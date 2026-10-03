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

  it("renders detail page on authenticated /lost-founds/1 route", async () => {
    window.history.pushState({}, 'Test page', '/lost-founds/1');
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid_token");
    vi.spyOn(userApi, "getProfile").mockResolvedValue({ id: 1, name: "Budi" });

    renderWithProviders(<App />, {
      preloadedState: {
        profile: { id: 1, name: "Budi" },
        lostFound: { id: 1, title: "Kunci Motor", user_id: 1, status: "lost", created_at: "2024-01-01" },
      },
    });

    expect(await screen.findByText("Kunci Motor")).toBeInTheDocument();
  });

  it("renders users page on authenticated /users route", async () => {
    window.history.pushState({}, 'Test page', '/users');
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid_token");
    vi.spyOn(userApi, "getProfile").mockResolvedValue({ id: 1, name: "Budi" });

    renderWithProviders(<App />, {
      preloadedState: {
        profile: { id: 1, name: "Budi" },
        users: [{ id: 1, name: "Budi", email: "budi@del.org" }],
      },
    });

    expect(await screen.findByText("Semua Pengguna")).toBeInTheDocument();
  });

  it("renders profile page on authenticated /profile route", async () => {
    window.history.pushState({}, 'Test page', '/profile');
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid_token");
    vi.spyOn(userApi, "getProfile").mockResolvedValue({ id: 1, name: "Budi" });

    renderWithProviders(<App />, {
      preloadedState: {
        profile: { id: 1, name: "Budi", email: "budi@del.org" },
      },
    });

    expect(await screen.findByText("Profil Akun")).toBeInTheDocument();
  });

  it("redirects unknown routes to home page", () => {
    window.history.pushState({}, 'Test page', '/unknown-page');
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<App />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
