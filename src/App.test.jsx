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
    window.history.pushState({}, 'Test page', '/');
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<App />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("renders login page on /auth/login", () => {
    window.history.pushState({}, 'Test page', '/auth/login');
    renderWithProviders(<App />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("renders register page on /auth/register", () => {
    window.history.pushState({}, 'Test page', '/auth/register');
    renderWithProviders(<App />);
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });

  it("renders dashboard on authenticated / route", async () => {
    window.history.pushState({}, 'Test page', '/');
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid_token");
    vi.spyOn(userApi, "getProfile").mockResolvedValue({ id: 1, name: "Budi" });

    renderWithProviders(<App />, {
      preloadedState: {
        profile: { id: 1, name: "Budi" },
        lostFounds: [],
        lostFoundStats: {},
      },
    });

    expect(await screen.findByText("Lost & Found")).toBeInTheDocument();
    expect(await screen.findByText("Daftar Barang Hilang & Ditemukan")).toBeInTheDocument();
  });

  it("redirects unknown routes to home page", () => {
    window.history.pushState({}, 'Test page', '/unknown-page');
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<App />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
