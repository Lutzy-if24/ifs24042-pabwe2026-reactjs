import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setLostFoundsActionCreator,
  asyncSetLostFounds,
  setLostFoundActionCreator,
  setIsLostFoundActionCreator,
  asyncSetLostFound,
  setIsLostFoundAddActionCreator,
  setIsLostFoundAddedActionCreator,
  asyncSetIsLostFoundAdd,
  setIsLostFoundChangeActionCreator,
  setIsLostFoundChangedActionCreator,
  asyncSetIsLostFoundChange,
  setIsLostFoundChangeCoverActionCreator,
  setIsLostFoundChangedCoverActionCreator,
  asyncSetIsLostFoundChangeCover,
  setIsLostFoundDeleteActionCreator,
  setIsLostFoundDeletedActionCreator,
  asyncSetIsLostFoundDelete,
  setLostFoundStatsActionCreator,
  asyncSetLostFoundStats,
} from "./action";
import lostFoundApi from "../api/lostFoundApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

vi.mock("../../../helpers/toolsHelper", async () => {
  const actual = await vi.importActual("../../../helpers/toolsHelper");
  return {
    ...actual,
    showErrorDialog: vi.fn(),
    showSuccessDialog: vi.fn(),
  };
});

describe("lost-founds action creators and thunks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("asyncSetLostFounds", () => {
    it("should dispatch setLostFoundsActionCreator on success", async () => {
      const mockList = [{ id: 1, title: "Domestic" }];
      vi.spyOn(lostFoundApi, "getLostFounds").mockResolvedValue(mockList);
      const dispatch = vi.fn();

      await asyncSetLostFounds()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundsActionCreator(mockList));
    });

    it("should dispatch empty array and showErrorDialog on failure", async () => {
      vi.spyOn(lostFoundApi, "getLostFounds").mockRejectedValue(new Error("Network Error"));
      const dispatch = vi.fn();

      await asyncSetLostFounds()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundsActionCreator([]));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Network Error");
    });
  });

  describe("asyncSetLostFound", () => {
    it("should dispatch setLostFoundActionCreator and setIsLostFoundActionCreator", async () => {
      const mockItem = { id: 10, title: "Found Wallet" };
      vi.spyOn(lostFoundApi, "getLostFoundById").mockResolvedValue(mockItem);
      const dispatch = vi.fn();

      await asyncSetLostFound(10)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundActionCreator(mockItem));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundActionCreator(true));
    });

    it("should dispatch null on failure and setIsLostFoundActionCreator(true) in finally", async () => {
      vi.spyOn(lostFoundApi, "getLostFoundById").mockRejectedValue(new Error("Not found"));
      const dispatch = vi.fn();

      await asyncSetLostFound(99)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundActionCreator(null));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Not found");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundActionCreator(true));
    });
  });

  describe("asyncSetIsLostFoundAdd", () => {
    it("should handle successful add flow", async () => {
      vi.spyOn(lostFoundApi, "postLostFound").mockResolvedValue("Success Add");
      const dispatch = vi.fn();

      await asyncSetIsLostFoundAdd({
        title: "Key",
        description: "Found",
        status: "found",
      })(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddedActionCreator(false));
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Success Add");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddActionCreator(false));
    });

    it("should handle error during add flow", async () => {
      vi.spyOn(lostFoundApi, "postLostFound").mockRejectedValue(new Error("Add Failed"));
      const dispatch = vi.fn();

      await asyncSetIsLostFoundAdd({
        title: "Key",
        description: "Found",
        status: "found",
      })(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Add Failed");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddActionCreator(false));
    });

    it("should use default success message when API returns no message on add", async () => {
      vi.spyOn(lostFoundApi, "postLostFound").mockResolvedValue(undefined);
      const dispatch = vi.fn();

      await asyncSetIsLostFoundAdd({
        title: "Key",
        description: "Found",
        status: "found",
      })(dispatch);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Barang berhasil ditambahkan!");
    });
  });

  describe("asyncSetIsLostFoundChange", () => {
    it("should handle successful update flow", async () => {
      vi.spyOn(lostFoundApi, "putLostFound").mockResolvedValue("Updated");
      const dispatch = vi.fn();

      await asyncSetIsLostFoundChange(5, {
        title: "Title",
        description: "Desc",
        status: "lost",
        is_completed: 1,
      })(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedActionCreator(false));
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Updated");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeActionCreator(false));
    });

    it("should use default success message when API returns no message on change", async () => {
      vi.spyOn(lostFoundApi, "putLostFound").mockResolvedValue(undefined);
      const dispatch = vi.fn();

      await asyncSetIsLostFoundChange(5, {
        title: "Title",
        description: "Desc",
        status: "lost",
        is_completed: 1,
      })(dispatch);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Barang berhasil diperbarui!");
    });

    it("should handle error during update flow", async () => {
      vi.spyOn(lostFoundApi, "putLostFound").mockRejectedValue(new Error("Update Error"));
      const dispatch = vi.fn();

      await asyncSetIsLostFoundChange(5, {
        title: "Title",
        description: "Desc",
        status: "lost",
        is_completed: 0,
      })(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Update Error");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeActionCreator(false));
    });
  });

  describe("asyncSetIsLostFoundChangeCover", () => {
    it("should handle cover upload success", async () => {
      vi.spyOn(lostFoundApi, "postLostFoundCover").mockResolvedValue("Cover Updated");
      const dispatch = vi.fn();
      const file = new File(["dummy"], "c.png");

      await asyncSetIsLostFoundChangeCover(5, file)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeCoverActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedCoverActionCreator(false));
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Cover Updated");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedCoverActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeCoverActionCreator(false));
    });

    it("should use default success message when API returns no message on cover upload", async () => {
      vi.spyOn(lostFoundApi, "postLostFoundCover").mockResolvedValue(undefined);
      const dispatch = vi.fn();
      const file = new File(["dummy"], "c.png");

      await asyncSetIsLostFoundChangeCover(5, file)(dispatch);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Cover berhasil diperbarui!");
    });

    it("should handle cover upload error", async () => {
      vi.spyOn(lostFoundApi, "postLostFoundCover").mockRejectedValue(new Error("Upload Error"));
      const dispatch = vi.fn();
      const file = new File(["dummy"], "c.png");

      await asyncSetIsLostFoundChangeCover(5, file)(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Upload Error");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedCoverActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeCoverActionCreator(false));
    });
  });

  describe("asyncSetIsLostFoundDelete", () => {
    it("should handle delete success", async () => {
      vi.spyOn(lostFoundApi, "deleteLostFound").mockResolvedValue("Deleted");
      const dispatch = vi.fn();

      await asyncSetIsLostFoundDelete(3)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeleteActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeletedActionCreator(false));
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Deleted");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeletedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeleteActionCreator(false));
    });

    it("should use default success message when API returns no message on delete", async () => {
      vi.spyOn(lostFoundApi, "deleteLostFound").mockResolvedValue(undefined);
      const dispatch = vi.fn();

      await asyncSetIsLostFoundDelete(3)(dispatch);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Barang berhasil dihapus!");
    });

    it("should handle delete error", async () => {
      vi.spyOn(lostFoundApi, "deleteLostFound").mockRejectedValue(new Error("Delete Fail"));
      const dispatch = vi.fn();

      await asyncSetIsLostFoundDelete(3)(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Delete Fail");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeletedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeleteActionCreator(false));
    });
  });

  describe("asyncSetLostFoundStats", () => {
    it("should dispatch stats on success", async () => {
      const mockStats = { stats_losts: { "01-01-2024": 1 } };
      vi.spyOn(lostFoundApi, "getLostFoundStats").mockResolvedValue(mockStats);
      const dispatch = vi.fn();

      await asyncSetLostFoundStats({ type: "daily" })(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundStatsActionCreator(mockStats));
    });

    it("should dispatch empty object and showErrorDialog on error", async () => {
      vi.spyOn(lostFoundApi, "getLostFoundStats").mockRejectedValue(new Error("Stats Error"));
      const dispatch = vi.fn();

      await asyncSetLostFoundStats()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundStatsActionCreator({}));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Stats Error");
    });
  });
});
