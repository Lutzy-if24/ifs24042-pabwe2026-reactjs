import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AddModal from "./AddModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

vi.mock("../../../helpers/toolsHelper", async () => {
  const actual = await vi.importActual("../../../helpers/toolsHelper");
  return {
    ...actual,
    showErrorDialog: vi.fn(),
  };
});

describe("AddModal", () => {
  it("does not render when show is false", () => {
    const { container } = renderWithProviders(
      <AddModal show={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("validates empty title and description inputs", () => {
    renderWithProviders(<AddModal show={true} onClose={vi.fn()} />);

    const form = screen.getByTestId("add-form");
    fireEvent.submit(form);
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Judul tidak boleh kosong");

    const titleInput = screen.getByTestId("add-title-input");
    fireEvent.change(titleInput, { target: { value: "Judul Barang" } });
    fireEvent.submit(form);
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("dispatches asyncSetIsLostFoundAdd on valid submit", () => {
    renderWithProviders(<AddModal show={true} onClose={vi.fn()} />);

    const titleInput = screen.getByTestId("add-title-input");
    const descInput = screen.getByTestId("add-description-input");
    const statusSelect = screen.getByTestId("add-status-select");
    const form = screen.getByTestId("add-form");

    fireEvent.change(titleInput, { target: { value: "Kunci Motor" } });
    fireEvent.change(descInput, { target: { value: "Ditemukan di parkiran" } });
    fireEvent.change(statusSelect, { target: { value: "found" } });

    fireEvent.submit(form);
  });

  it("closes modal on close or cancel button click", () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal show={true} onClose={onClose} />);

    const closeBtn = screen.getByTestId("close-add-modal-btn");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();

    const cancelBtn = screen.getByTestId("cancel-add-modal-btn");
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("handles isLostFoundAdd state change and resets modal when successfully added", () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal show={true} onClose={onClose} />, {
      preloadedState: {
        isLostFoundAdd: true,
        isLostFoundAdded: true,
      },
    });

    expect(onClose).toHaveBeenCalled();
  });
});
