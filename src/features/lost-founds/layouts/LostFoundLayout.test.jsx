import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import LostFoundLayout from "./LostFoundLayout";
import apiHelper from "../../../helpers/apiHelper";
import { renderWithProviders } from "../../../test-utils";

vi.mock("../../../helpers/apiHelper", async () => {
  const actual = await vi.importActual("../../../helpers/apiHelper");
  return {
    ...actual,
    default: {
      ...actual.default,
      getAccessToken: vi.fn(),
      putAccessToken: vi.fn(),
    },
  };
});

describe("LostFoundLayout", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("redirects to login when token is missing", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);
    renderWithProviders(<LostFoundLayout />, { route: "/" });

    expect(screen.queryByText("Memuat sesi pengguna...")).not.toBeInTheDocument();
  });

  it("fetches profile when token is present and renders loading indicator initially", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid_token");
    renderWithProviders(<LostFoundLayout />, {
      preloadedState: { profile: null },
      route: "/",
    });

    expect(screen.getByText("Memuat sesi pengguna...")).toBeInTheDocument();
  });

  it("renders layout with navbar and sidebar when profile is present and handle sidebar toggling & logout", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid_token");
    const mockProfile = { name: "Budi", email: "budi@example.com" };

    renderWithProviders(<LostFoundLayout />, {
      preloadedState: {
        profile: mockProfile,
        isProfile: false,
        isAuthLogout: false,
      },
      route: "/",
    });

    expect(screen.getByText("Lost & Found")).toBeInTheDocument();

    const toggleBtn = screen.getByTestId("toggle-sidebar-btn");
    fireEvent.click(toggleBtn);

    const backdrop = screen.getByTestId("sidebar-backdrop");
    fireEvent.click(backdrop);

    const dropdownBtn = screen.getByTestId("profile-dropdown-button");
    fireEvent.click(dropdownBtn);

    const logoutBtn = screen.getByTestId("dropdown-logout-button");
    fireEvent.click(logoutBtn);
  });

  it("clears token and redirects to login when isProfile is true but profile is null", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid_token");
    const putTokenSpy = vi.spyOn(apiHelper, "putAccessToken");

    renderWithProviders(<LostFoundLayout />, {
      preloadedState: {
        profile: null,
        isProfile: true,
      },
      route: "/",
    });

    expect(putTokenSpy).toHaveBeenCalledWith("");
  });

  it("does not clear token when isProfile is true and profile is present", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid_token");
    const putTokenSpy = vi.spyOn(apiHelper, "putAccessToken");

    renderWithProviders(<LostFoundLayout />, {
      preloadedState: {
        profile: { name: "Budi" },
        isProfile: true,
      },
      route: "/",
    });

    expect(putTokenSpy).not.toHaveBeenCalledWith("");
  });

  it("redirects to login when isAuthLogout becomes true", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid_token");

    renderWithProviders(<LostFoundLayout />, {
      preloadedState: {
        profile: { name: "Budi" },
        isAuthLogout: true,
      },
      route: "/",
    });

    expect(screen.getByText("Lost & Found")).toBeInTheDocument();
  });
});
