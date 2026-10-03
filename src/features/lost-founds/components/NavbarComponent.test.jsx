import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";

const mockProfile = {
  name: "John Doe",
  email: "john@example.com",
  photo: "img/users/john.png",
};

describe("NavbarComponent", () => {
  it("renders brand name and profile info", () => {
    render(
      <BrowserRouter>
        <NavbarComponent
          profile={mockProfile}
          handleLogout={vi.fn()}
          onToggleSidebar={vi.fn()}
          isSidebarOpen={false}
        />
      </BrowserRouter>
    );

    expect(screen.getByText("Lost & Found")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("toggles dropdown and executes logout and navigate profile", () => {
    const handleLogout = vi.fn();
    render(
      <BrowserRouter>
        <NavbarComponent
          profile={mockProfile}
          handleLogout={handleLogout}
          onToggleSidebar={vi.fn()}
          isSidebarOpen={false}
        />
      </BrowserRouter>
    );

    const dropdownBtn = screen.getByTestId("profile-dropdown-button");
    fireEvent.click(dropdownBtn);

    expect(screen.getByTestId("profile-dropdown-menu")).toBeInTheDocument();

    const profileLink = screen.getByTestId("dropdown-profile-link");
    fireEvent.click(profileLink);

    fireEvent.click(dropdownBtn);
    const logoutBtn = screen.getByTestId("dropdown-logout-button");
    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalled();
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <BrowserRouter>
        <div>
          <button data-testid="outside-element">Outside</button>
          <NavbarComponent
            profile={mockProfile}
            handleLogout={vi.fn()}
            onToggleSidebar={vi.fn()}
            isSidebarOpen={false}
          />
        </div>
      </BrowserRouter>
    );

    const dropdownBtn = screen.getByTestId("profile-dropdown-button");
    fireEvent.click(dropdownBtn);
    expect(screen.getByTestId("profile-dropdown-menu")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside-element"));
    expect(screen.queryByTestId("profile-dropdown-menu")).not.toBeInTheDocument();
  });

  it("renders fallback avatar when photo is missing", () => {
    render(
      <BrowserRouter>
        <NavbarComponent
          profile={{ name: "Alice", email: "alice@example.com" }}
          handleLogout={vi.fn()}
          onToggleSidebar={vi.fn()}
          isSidebarOpen={false}
        />
      </BrowserRouter>
    );

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("triggers onToggleSidebar on mobile menu button click", () => {
    const onToggleSidebar = vi.fn();
    render(
      <BrowserRouter>
        <NavbarComponent
          profile={mockProfile}
          handleLogout={vi.fn()}
          onToggleSidebar={onToggleSidebar}
          isSidebarOpen={true}
        />
      </BrowserRouter>
    );

    const toggleBtn = screen.getByTestId("toggle-sidebar-btn");
    fireEvent.click(toggleBtn);
    expect(onToggleSidebar).toHaveBeenCalled();
  });
});
