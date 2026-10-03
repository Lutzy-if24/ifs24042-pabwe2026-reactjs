import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import { renderWithProviders } from "./test-utils";
import apiHelper from "./helpers/apiHelper";
import userApi from "./features/users/api/userApi";

vi.mock("./helpers/apiHelper", async () => {
  const actual = await vi.importActual("./helpers/apiHelper");
  return {
    ...actual,
    default: {
      ...actual.default,
      getAccessToken: vi.fn(),
    },
  };
});

describe("App Routing", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("redirects unauthenticated user from home route to login page", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<App />, { route: "/" });
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("renders login page on /auth/login", () => {
    renderWithProviders(<App />, { route: "/auth/login" });
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("renders register page on /auth/register", () => {
    renderWithProviders(<App />, { route: "/auth/register" });
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });

  it("renders dashboard on authenticated / route", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid_token");
    vi.spyOn(userApi, "getProfile").mockResolvedValue({ id: 1, name: "Budi" });

    renderWithProviders(<App />, {
      preloadedState: {
        profile: { id: 1, name: "Budi" },
        lostFounds: [],
        lostFoundStats: {},
      },
      route: "/",
    });

    expect(await screen.findByText("Lost & Found")).toBeInTheDocument();
    expect(await screen.findByText("Daftar Barang Hilang & Ditemukan")).toBeInTheDocument();
  });

  it("redirects unknown routes to home page", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<App />, { route: "/unknown-page" });
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
