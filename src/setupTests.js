import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
    close: vi.fn(),
  },
}));
