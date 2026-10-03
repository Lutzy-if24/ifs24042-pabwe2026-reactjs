import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChangeModal from "./ChangeModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

vi.mock("../../../helpers/toolsHelper", async () => {
  const actual = await vi.importActual("../../../helpers/toolsHelper");
  return {
    ...actual,
    showErrorDialog: vi.fn(),
  };
});

describe("ChangeModal", () => {
  const mockLostFound = {
    id: 1,
    title: "Kunci Rumah",
    description: "Kuningan",
    status: "lost",
    is_completed: 0,
  };

  it("does not render when show is false", () => {
    const { container } = renderWithProviders(
      <ChangeModal show={false} onClose={vi.fn()} lostFoundId={1} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("populates inputs when lostFound data is present", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} lostFoundId={1} />, {
      preloadedState: {
        lostFound: mockLostFound,
      },
    });

    expect(screen.getByTestId("edit-title-input")).toHaveValue("Kunci Rumah");
    expect(screen.getByTestId("edit-description-input")).toHaveValue("Kuningan");
    expect(screen.getByTestId("edit-status-select")).toHaveValue("lost");
    expect(screen.getByTestId("edit-completed-select")).toHaveValue("0");
  });

  it("validates empty title and description", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} lostFoundId={1} />, {
      preloadedState: {
        lostFound: mockLostFound,
      },
    });

    const titleInput = screen.getByTestId("edit-title-input");
    const form = screen.getByTestId("edit-form");

    fireEvent.change(titleInput, { target: { value: "   " } });
    fireEvent.submit(form);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Judul tidak boleh kosong");

    fireEvent.change(titleInput, { target: { value: "Judul Baru" } });
    const descInput = screen.getByTestId("edit-description-input");
    fireEvent.change(descInput, { target: { value: "   " } });
    fireEvent.submit(form);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("submits changed values and toggles is_completed", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} lostFoundId={1} />, {
      preloadedState: {
        lostFound: mockLostFound,
      },
    });

    const completedSelect = screen.getByTestId("edit-completed-select");
    fireEvent.change(completedSelect, { target: { value: "1" } });

    const form = screen.getByTestId("edit-form");
    fireEvent.submit(form);
  });

  it("closes modal on cancel button click", () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal show={true} onClose={onClose} lostFoundId={1} />);

    const cancelBtn = screen.getByTestId("cancel-edit-modal-btn");
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalled();

    const closeBtn = screen.getByTestId("close-edit-modal-btn");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("handles isLostFoundChange state completion and closes modal", () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal show={true} onClose={onClose} lostFoundId={1} />, {
      preloadedState: {
        isLostFoundChange: true,
        isLostFoundChanged: true,
      },
    });

    expect(onClose).toHaveBeenCalled();
  });
});
