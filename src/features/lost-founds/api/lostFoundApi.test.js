import { describe, it, expect, vi, beforeEach } from "vitest";
import lostFoundApi from "./lostFoundApi";
import apiHelper from "../../../helpers/apiHelper";

describe("lostFoundApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getLostFounds", () => {
    it("should fetch lost-founds without params and return list", async () => {
      const mockData = [{ id: 1, title: "Kunci", status: "lost" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_founds: mockData },
        }),
      });

      const res = await lostFoundApi.getLostFounds();
      expect(res).toEqual(mockData);
    });

    it("should fetch lost-founds with query parameters", async () => {
      const mockData = [{ id: 2, title: "Dompet", status: "found" }];
      const fetchDataSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_founds: mockData },
        }),
      });

      const res = await lostFoundApi.getLostFounds({
        status: "found",
        is_completed: 1,
        is_me: 1,
      });
      expect(res).toEqual(mockData);
      expect(fetchDataSpy).toHaveBeenCalledWith(
        expect.stringContaining("status=found&is_completed=1&is_me=1"),
        expect.any(Object)
      );
    });

    it("should fallback to empty array if data.lost_founds is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      });

      const res = await lostFoundApi.getLostFounds();
      expect(res).toEqual([]);
    });

    it("should throw error with details if status is fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
          data: { field: ["Error field"] },
        }),
      });

      await expect(lostFoundApi.getLostFounds()).rejects.toThrow(
        "Data tidak valid: Error field"
      );
    });

    it("should throw error with default message when result.message is empty", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.getLostFounds()).rejects.toThrow(
        "Gagal mengambil daftar barang"
      );
    });

    it("should throw error using default message and error details when result.message is empty", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "",
          data: { field: ["Error detail"] },
        }),
      });

      await expect(lostFoundApi.getLostFounds()).rejects.toThrow(
        "Gagal mengambil daftar barang: Error detail"
      );
    });

    it("should throw error with message when data is empty object or not an object", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValueOnce({
        json: async () => ({
          status: "fail",
          message: "Failure with empty data object",
          data: {},
        }),
      }).mockResolvedValueOnce({
        json: async () => ({
          status: "fail",
          message: "Failure with string data",
          data: "not-an-object",
        }),
      });

      await expect(lostFoundApi.getLostFounds()).rejects.toThrow(
        "Failure with empty data object"
      );
      await expect(lostFoundApi.getLostFounds()).rejects.toThrow(
        "Failure with string data"
      );
    });
  });

  describe("getLostFoundById", () => {
    it("should return single item detail on success", async () => {
      const mockItem = { id: 8, title: "HP Hilang", status: "lost" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_found: mockItem },
        }),
      });

      const res = await lostFoundApi.getLostFoundById(8);
      expect(res).toEqual(mockItem);
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Tidak ditemukan",
        }),
      });

      await expect(lostFoundApi.getLostFoundById(99)).rejects.toThrow("Tidak ditemukan");
    });
  });

  describe("postLostFound", () => {
    it("should post new item and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Barang berhasil ditambahkan!",
          data: { lost_found_id: 10 },
        }),
      });

      const msg = await lostFoundApi.postLostFound({
        title: "Tas Merah",
        description: "Tertinggal di kantin",
        status: "lost",
      });
      expect(msg).toBe("Barang berhasil ditambahkan!");
    });

    it("should use fallback message if message is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
        }),
      });

      const msg = await lostFoundApi.postLostFound({
        title: "Tas",
        description: "Rincian",
        status: "found",
      });
      expect(msg).toBe("Barang berhasil ditambahkan!");
    });

    it("should throw error on failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal",
        }),
      });

      await expect(
        lostFoundApi.postLostFound({ title: "", description: "", status: "" })
      ).rejects.toThrow("Gagal");
    });
  });

  describe("putLostFound", () => {
    it("should update item and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Barang berhasil diperbarui!",
        }),
      });

      const msg = await lostFoundApi.putLostFound(8, {
        title: "Tas Biru",
        description: "Sudah ketemu",
        status: "found",
        is_completed: 1,
      });
      expect(msg).toBe("Barang berhasil diperbarui!");
    });

    it("should use fallback message if message is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
        }),
      });

      const msg = await lostFoundApi.putLostFound(8, {
        title: "Tas",
        description: "Ketemu",
        status: "found",
        is_completed: "0",
      });
      expect(msg).toBe("Barang berhasil diperbarui!");
    });

    it("should throw error on failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal update",
        }),
      });

      await expect(
        lostFoundApi.putLostFound(8, { title: "", description: "", status: "", is_completed: 0 })
      ).rejects.toThrow("Gagal update");
    });
  });

  describe("postLostFoundCover", () => {
    it("should upload cover file and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Cover berhasil diperbarui!",
        }),
      });

      const file = new File(["dummy"], "cover.png", { type: "image/png" });
      const msg = await lostFoundApi.postLostFoundCover(8, file);
      expect(msg).toBe("Cover berhasil diperbarui!");
    });

    it("should handle Blob without name", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
        }),
      });

      const blob = new Blob(["dummy"], { type: "image/png" });
      const msg = await lostFoundApi.postLostFoundCover(8, blob);
      expect(msg).toBe("Cover berhasil diperbarui!");
    });

    it("should throw error on upload fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Format file salah",
        }),
      });

      const file = new File(["dummy"], "cover.txt", { type: "text/plain" });
      await expect(lostFoundApi.postLostFoundCover(8, file)).rejects.toThrow("Format file salah");
    });
  });

  describe("deleteLostFound", () => {
    it("should delete item and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Barang berhasil dihapus!",
        }),
      });

      const msg = await lostFoundApi.deleteLostFound(8);
      expect(msg).toBe("Barang berhasil dihapus!");
    });

    it("should use fallback message if missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
        }),
      });

      const msg = await lostFoundApi.deleteLostFound(8);
      expect(msg).toBe("Barang berhasil dihapus!");
    });

    it("should throw error on delete failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Akses dilarang",
        }),
      });

      await expect(lostFoundApi.deleteLostFound(8)).rejects.toThrow("Akses dilarang");
    });
  });

  describe("deleteMyLostFounds", () => {
    it("should delete all my items and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Semua barang saya berhasil dihapus!",
        }),
      });

      const msg = await lostFoundApi.deleteMyLostFounds();
      expect(msg).toBe("Semua barang saya berhasil dihapus!");
    });

    it("should use fallback message if missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
        }),
      });

      const msg = await lostFoundApi.deleteMyLostFounds();
      expect(msg).toBe("Semua barang saya berhasil dihapus!");
    });

    it("should throw error on failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal menghapus",
        }),
      });

      await expect(lostFoundApi.deleteMyLostFounds()).rejects.toThrow("Gagal menghapus");
    });
  });

  describe("getLostFoundStats", () => {
    it("should fetch daily stats with query params", async () => {
      const mockStats = { stats_losts: { "06-10-2024": 1 } };
      const fetchDataSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: mockStats,
        }),
      });

      const res = await lostFoundApi.getLostFoundStats({
        end_date: "2024-10-06 00:00:00",
        total_data: 7,
        type: "daily",
      });
      expect(res).toEqual(mockStats);
      expect(fetchDataSpy).toHaveBeenCalledWith(
        expect.stringContaining("/stats/daily?end_date=2024-10-06+00%3A00%3A00&total_data=7"),
        expect.any(Object)
      );
    });

    it("should fetch monthly stats without query params", async () => {
      const mockStats = { stats_losts: { "10-2024": 5 } };
      const fetchDataSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: mockStats,
        }),
      });

      const res = await lostFoundApi.getLostFoundStats({ type: "monthly" });
      expect(res).toEqual(mockStats);
      expect(fetchDataSpy).toHaveBeenCalledWith(
        expect.stringContaining("/stats/monthly"),
        expect.any(Object)
      );
    });

    it("should fallback to empty object if data is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
        }),
      });

      const res = await lostFoundApi.getLostFoundStats();
      expect(res).toEqual({});
    });

    it("should throw error on stats failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal mengambil stats",
        }),
      });

      await expect(lostFoundApi.getLostFoundStats()).rejects.toThrow("Gagal mengambil stats");
    });
  });
});
