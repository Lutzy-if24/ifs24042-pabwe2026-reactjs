import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SidebarComponent from "./SidebarComponent";

describe("SidebarComponent", () => {
  it("renders menu items correctly", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SidebarComponent isSidebarOpen={false} onCloseMobile={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard / Laporan")).toBeInTheDocument();
    expect(screen.getByText("Statistik")).toBeInTheDocument();
    expect(screen.getByText("Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
  });

  it("handles mobile backdrop click and item clicks", () => {
    const onCloseMobile = vi.fn();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SidebarComponent isSidebarOpen={true} onCloseMobile={onCloseMobile} />
      </MemoryRouter>
    );

    const backdrop = screen.getByTestId("sidebar-backdrop");
    fireEvent.click(backdrop);
    expect(onCloseMobile).toHaveBeenCalledTimes(1);

    const statsLink = screen.getByText("Statistik");
    fireEvent.click(statsLink);
    expect(onCloseMobile).toHaveBeenCalledTimes(2);
  });

  it("highlights active hash menu for statistik", () => {
    render(
      <MemoryRouter initialEntries={["/#statistik"]}>
        <SidebarComponent isSidebarOpen={false} onCloseMobile={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Statistik")).toBeInTheDocument();
  });
});
