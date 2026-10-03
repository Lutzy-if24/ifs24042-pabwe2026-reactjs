import { describe, it, expect, vi } from "vitest";
import Swal from "sweetalert2";
import {
  showErrorDialog,
  showWarningDialog,
  showSuccessDialog,
  showConfirmDialog,
  formatDate,
  getImageUrl,
  transformStatsData,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
    close: vi.fn(),
  },
}));

describe("toolsHelper", () => {
  it("should call Swal.fire for showErrorDialog and handle confirmation", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    await showErrorDialog("Error test");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Terjadi Kesalahan",
        text: "Error test",
        icon: "error",
      })
    );
    expect(Swal.close).toHaveBeenCalled();

    // Not confirmed branch
    Swal.fire.mockResolvedValue({ isConfirmed: false });
    await showErrorDialog("Error test");
  });

  it("should call Swal.fire for showWarningDialog and handle confirmation", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    await showWarningDialog("Warning test");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Peringatan",
        text: "Warning test",
        icon: "warning",
      })
    );
    expect(Swal.close).toHaveBeenCalled();

    Swal.fire.mockResolvedValue({ isConfirmed: false });
    await showWarningDialog("Warning test");
  });

  it("should call Swal.fire for showSuccessDialog and handle confirmation", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    await showSuccessDialog("Success test");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Tindakan Berhasil",
        text: "Success test",
        icon: "success",
      })
    );
    expect(Swal.close).toHaveBeenCalled();

    Swal.fire.mockResolvedValue({ isConfirmed: false });
    await showSuccessDialog("Success test");
  });

  it("should call Swal.fire for showConfirmDialog", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    const res = await showConfirmDialog("Confirm test?");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Konfirmasi",
        text: "Confirm test?",
        icon: "question",
      })
    );
    expect(res.isConfirmed).toBe(true);
  });

  it("should format date correctly or return fallback for empty date", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    const formatted = formatDate("2024-02-26T02:34:26.000000Z");
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe("string");
  });

  it("should resolve image URL correctly with getImageUrl", () => {
    expect(getImageUrl(null, "placeholder.png")).toBe("placeholder.png");
    expect(getImageUrl("https://example.com/img.jpg")).toBe("https://example.com/img.jpg");
    expect(getImageUrl("http://example.com/img.jpg")).toBe("http://example.com/img.jpg");
    expect(getImageUrl("img/lost-founds/cover.png")).toBe("https://open-api.delcom.org/img/lost-founds/cover.png");
    expect(getImageUrl("/img/lost-founds/cover.png")).toBe("https://open-api.delcom.org/img/lost-founds/cover.png");
  });

  it("should transform stats data into rows of label, lost, found", () => {
    expect(transformStatsData(null)).toEqual([]);
    expect(transformStatsData("invalid")).toEqual([]);
    const statsInput = {
      stats_losts: { "06-10-2024": 3, "07-10-2024": 1 },
      stats_founds: { "06-10-2024": 2, "08-10-2024": 5 },
    };
    const rows = transformStatsData(statsInput);
    expect(rows).toEqual([
      { label: "06-10-2024", lost: 3, found: 2 },
      { label: "07-10-2024", lost: 1, found: 0 },
      { label: "08-10-2024", lost: 0, found: 5 },
    ]);
  });
});
