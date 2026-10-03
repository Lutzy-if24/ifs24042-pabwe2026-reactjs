import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./HomePage";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import lostFoundApi from "../api/lostFoundApi";

vi.mock("../../../helpers/toolsHelper", async () => {
  const actual = await vi.importActual("../../../helpers/toolsHelper");
  return {
    ...actual,
    showConfirmDialog: vi.fn(),
  };
});

describe("HomePage", () => {
  const mockProfile = { id: 1, name: "Budi", email: "budi@del.org" };
  const mockItems = [
    {
      id: 10,
      user_id: 1,
      title: "Kunci Motor",
      description: "Hilang di perpustakaan",
      status: "lost",
      is_completed: 0,
      cover: "img/cover1.png",
      created_at: "2024-02-28T07:49:32.000000Z",
      author: { name: "Budi" },
    },
    {
      id: 11,
      user_id: 2,
      title: "Dompet Cokelat",
      description: "Ditemukan di gedung 7",
      status: "found",
      is_completed: 1,
      cover: null,
      created_at: "2024-02-28T08:00:00.000000Z",
      author: { name: "Ani" },
    },
  ];

  const mockStats = {
    stats_losts: { "06-10-2024": 2 },
    stats_founds: { "06-10-2024": 1 },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(lostFoundApi, "getLostFounds").mockResolvedValue(mockItems);
    vi.spyOn(lostFoundApi, "getLostFoundStats").mockResolvedValue(mockStats);
  });

  it("returns null if profile is missing", () => {
    const { container } = renderWithProviders(<HomePage />, {
      preloadedState: { profile: null },
    });
    expect(container.firstChild).toBeNull();
  });

  it("renders lost & found items and summary count", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: mockItems,
        lostFoundStats: mockStats,
      },
    });

    expect(screen.getByText("Daftar Barang Hilang & Ditemukan")).toBeInTheDocument();
    expect(screen.getByText("Kunci Motor")).toBeInTheDocument();
    expect(screen.getByText("Dompet Cokelat")).toBeInTheDocument();
    expect(screen.getByTestId("stats-section")).toBeInTheDocument();
  });

  it("filters items by live search", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: mockItems,
        lostFoundStats: mockStats,
      },
    });

    const searchInput = screen.getByTestId("search-lost-found-input");
    fireEvent.change(searchInput, { target: { value: "Dompet" } });

    expect(screen.queryByText("Kunci Motor")).not.toBeInTheDocument();
    expect(screen.getByText("Dompet Cokelat")).toBeInTheDocument();
  });

  it("filters items by status, condition, and my items toggle", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: mockItems,
        lostFoundStats: mockStats,
      },
    });

    const statusSelect = screen.getByTestId("status-filter-select");
    fireEvent.change(statusSelect, { target: { value: "lost" } });

    const completedSelect = screen.getByTestId("completed-filter-select");
    fireEvent.change(completedSelect, { target: { value: "0" } });

    const myItemsBtn = screen.getByTestId("filter-my-items-btn");
    fireEvent.click(myItemsBtn);
    fireEvent.click(myItemsBtn);
  });

  it("opens add modal and change modal", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: mockItems,
      },
    });

    const addBtn = screen.getByTestId("add-lost-found-btn");
    fireEvent.click(addBtn);
    expect(screen.getByTestId("add-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-add-modal-btn"));

    const editBtn = screen.getByTestId("edit-item-10");
    fireEvent.click(editBtn);
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-edit-modal-btn"));
  });

  it("handles toggling completion and item deletion for owner", async () => {
    toolsHelper.showConfirmDialog.mockResolvedValue({ isConfirmed: true });
    vi.spyOn(lostFoundApi, "putLostFound").mockResolvedValue("Success");
    vi.spyOn(lostFoundApi, "deleteLostFound").mockResolvedValue("Success");

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: mockItems,
      },
    });

    const toggleBtn = screen.getByTestId("toggle-complete-10");
    fireEvent.click(toggleBtn);

    const deleteBtn = screen.getByTestId("delete-item-10");
    fireEvent.click(deleteBtn);

    expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
  });

  it("switches stats between daily and monthly", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: mockItems,
        lostFoundStats: mockStats,
      },
    });

    const monthlyBtn = screen.getByTestId("stats-monthly-btn");
    fireEvent.click(monthlyBtn);

    const dailyBtn = screen.getByTestId("stats-daily-btn");
    fireEvent.click(dailyBtn);
  });

  it("navigates to detail page on view click", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: mockItems,
      },
    });

    const viewBtn = screen.getByTestId("view-item-10");
    fireEvent.click(viewBtn);
  });

  it("renders item with missing author and handles toggling item with is_completed = 1", () => {
    const itemCompleted = {
      id: 99,
      user_id: 1,
      title: "Item Completed",
      description: "Desc",
      status: "lost",
      is_completed: 1,
      author: null,
    };

    toolsHelper.showConfirmDialog.mockResolvedValue({ isConfirmed: true });
    vi.spyOn(lostFoundApi, "putLostFound").mockResolvedValue("Success");

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: [itemCompleted],
      },
    });

    expect(screen.getByText("Anonim")).toBeInTheDocument();

    const toggleBtn = screen.getByTestId("toggle-complete-99");
    fireEvent.click(toggleBtn);
  });

  it("does not delete item when confirm dialog is canceled on home page", async () => {
    toolsHelper.showConfirmDialog.mockResolvedValue({ isConfirmed: false });
    const deleteSpy = vi.spyOn(lostFoundApi, "deleteLostFound");

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: mockItems,
      },
    });

    const deleteBtn = screen.getByTestId("delete-item-10");
    fireEvent.click(deleteBtn);
    expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("handles null lostFounds state and search query with null item title or description", () => {
    const itemNullTitleDesc = {
      id: 55,
      user_id: 1,
      title: null,
      description: null,
      status: "lost",
      is_completed: 0,
    };

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: [itemNullTitleDesc],
      },
    });

    const searchInput = screen.getByTestId("search-lost-found-input");
    fireEvent.change(searchInput, { target: { value: "test" } });

    // Test non-array lostFounds fallback
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: null,
      },
    });
  });

  it("refreshes lost-founds list when isLostFoundDeleted is true with isMeFilter true and false", () => {
    const { rerender } = renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        lostFounds: mockItems,
        isLostFoundDeleted: true,
      },
    });

    const myItemsBtn = screen.getByTestId("filter-my-items-btn");
    fireEvent.click(myItemsBtn);
  });
});
