import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeCoverModal from "./ChangeCoverModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

vi.mock("../../../helpers/toolsHelper", async () => {
  const actual = await vi.importActual("../../../helpers/toolsHelper");
  return {
    ...actual,
    showErrorDialog: vi.fn(),
  };
});

describe("ChangeCoverModal", () => {
  const mockLostFound = { id: 1, title: "Kunci" };

  beforeEach(() => {
    vi.restoreAllMocks();
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:preview-url");
  });

  it("does not render when show is false or lostFound is null", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal show={false} onClose={vi.fn()} lostFound={mockLostFound} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("validates file selection before submit", () => {
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={vi.fn()} lostFound={mockLostFound} />
    );

    const submitBtn = screen.getByTestId("submit-cover-modal-btn");
    fireEvent.click(submitBtn);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
      "Pilih file cover terlebih dahulu!"
    );
  });

  it("validates file type and file size", () => {
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={vi.fn()} lostFound={mockLostFound} />
    );

    const input = screen.getByTestId("cover-file-input");

    // Invalid type
    const invalidFile = new File(["test"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [invalidFile] } });
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
      "Hanya file JPEG, JPG, atau PNG yang diperbolehkan!"
    );

    // Large file (>2MB)
    const largeFile = new File([new ArrayBuffer(3 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });
    fireEvent.change(input, { target: { files: [largeFile] } });
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
      "Ukuran file terlalu besar. Maksimal 2MB!"
    );
  });

  it("previews selected image and submits on valid file", () => {
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={vi.fn()} lostFound={mockLostFound} />
    );

    const file = new File(["valid"], "valid.jpg", { type: "image/jpeg" });
    const input = screen.getByTestId("cover-file-input");
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByAltText("Preview")).toBeInTheDocument();

    const submitBtn = screen.getByTestId("submit-cover-modal-btn");
    fireEvent.click(submitBtn);
  });

  it("closes modal on cancel and close button clicks", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} lostFound={mockLostFound} />
    );

    const cancelBtn = screen.getByTestId("cancel-cover-modal-btn");
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalled();

    const closeBtn = screen.getByTestId("close-cover-modal-btn");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("handles isLostFoundChangeCover state completion and closes modal", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} lostFound={mockLostFound} />,
      {
        preloadedState: {
          isLostFoundChangeCover: true,
          isLostFoundChangedCover: true,
        },
      }
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("handles isLostFoundChangeCover completion when lostFound has no id", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} lostFound={{}} />,
      {
        preloadedState: {
          isLostFoundChangeCover: true,
          isLostFoundChangedCover: true,
        },
      }
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("does nothing when file input change has empty files list", () => {
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={vi.fn()} lostFound={mockLostFound} />
    );

    const input = screen.getByTestId("cover-file-input");
    fireEvent.change(input, { target: { files: [] } });
  });
});
