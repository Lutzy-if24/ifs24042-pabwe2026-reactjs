import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Routes, Route } from "react-router-dom";
import DetailPage from "./DetailPage";
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

describe("DetailPage", () => {
  const mockProfile = { id: 1, name: "Budi" };
  const mockLostFoundOwner = {
    id: 8,
    user_id: 1,
    title: "HP Samsung",
    description: "Tertinggal di Lab",
    status: "found",
    is_completed: 0,
    cover: "img/cover.png",
    created_at: "2024-02-28T07:49:32.000000Z",
    author: { name: "Budi", photo: "img/user.png" },
  };

  const mockLostFoundOther = {
    ...mockLostFoundOwner,
    user_id: 99,
    author: { name: "Lainnya", photo: null },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(lostFoundApi, "getLostFoundById").mockResolvedValue(mockLostFoundOwner);
  });

  it("renders loading spinner if profile or lostFound is missing", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: { profile: null, lostFound: null },
      route: "/lost-founds/8",
    });

    expect(screen.getByText("Memuat detail barang...")).toBeInTheDocument();
  });

  it("renders details and action buttons for owner", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: mockLostFoundOwner,
      },
      route: "/lost-founds/8",
    });

    expect(screen.getByText("HP Samsung")).toBeInTheDocument();
    expect(screen.getByText("Tertinggal di Lab")).toBeInTheDocument();
    expect(screen.getByTestId("edit-cover-btn")).toBeInTheDocument();
    expect(screen.getByTestId("edit-detail-btn")).toBeInTheDocument();
    expect(screen.getByTestId("delete-detail-btn")).toBeInTheDocument();
  });

  it("hides action buttons for non-owner", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: mockLostFoundOther,
      },
      route: "/lost-founds/8",
    });

    expect(screen.getByText("HP Samsung")).toBeInTheDocument();
    expect(screen.queryByTestId("edit-cover-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("edit-detail-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-detail-btn")).not.toBeInTheDocument();
  });

  it("opens edit cover and edit modals on button click", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: mockLostFoundOwner,
      },
      route: "/lost-founds/8",
    });

    fireEvent.click(screen.getByTestId("edit-cover-btn"));
    expect(screen.getByTestId("change-cover-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-cover-modal-btn"));

    fireEvent.click(screen.getByTestId("edit-detail-btn"));
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-edit-modal-btn"));
  });

  it("dispatches asyncSetLostFound when id param is present", () => {
    window.history.pushState({}, "", "/lost-founds/8");
    renderWithProviders(
      <Routes>
        <Route path="/lost-founds/:id" element={<DetailPage />} />
      </Routes>,
      {
        preloadedState: {
          profile: mockProfile,
          lostFound: mockLostFoundOwner,
        },
      }
    );
  });

  it("handles delete action after confirm", async () => {
    toolsHelper.showConfirmDialog.mockResolvedValue({ isConfirmed: true });
    vi.spyOn(lostFoundApi, "deleteLostFound").mockResolvedValue("Deleted");

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: mockLostFoundOwner,
      },
      route: "/lost-founds/8",
    });

    fireEvent.click(screen.getByTestId("delete-detail-btn"));
    expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
  });

  it("redirects to home if lostFound is missing after fetch", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: null,
        isLostFound: true,
      },
      route: "/lost-founds/99",
    });

    expect(screen.getByText("Memuat detail barang...")).toBeInTheDocument();
  });

  it("redirects to home when isLostFoundDeleted is true", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: mockLostFoundOwner,
        isLostFoundDeleted: true,
      },
      route: "/lost-founds/8",
    });

    expect(screen.getByText("HP Samsung")).toBeInTheDocument();
  });

  it("renders status lost, is_completed 1, missing author info, and missing description", () => {
    const itemLost = {
      id: 88,
      user_id: 2,
      title: "Barang Hilang 88",
      description: null,
      status: "lost",
      is_completed: 1,
      author: null,
    };

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: itemLost,
      },
    });

    expect(screen.getByText("Barang Hilang")).toBeInTheDocument();
    expect(screen.getByText("Selesai")).toBeInTheDocument();
    expect(screen.getByText("Pengguna Anonim")).toBeInTheDocument();
    expect(screen.getByText("U")).toBeInTheDocument();
    expect(
      screen.getByText("Tidak ada deskripsi rincian untuk barang ini.")
    ).toBeInTheDocument();
  });

  it("does not delete item if confirm dialog is canceled", async () => {
    toolsHelper.showConfirmDialog.mockResolvedValue({ isConfirmed: false });
    const deleteSpy = vi.spyOn(lostFoundApi, "deleteLostFound");

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: mockLostFoundOwner,
      },
      route: "/lost-founds/8",
    });

    fireEvent.click(screen.getByTestId("delete-detail-btn"));
    expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
    expect(deleteSpy).not.toHaveBeenCalled();
  });
});
