import { render, screen, fireEvent } from "@testing-library/react";
import PollList from "../../pages/voter/PollList.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import api from "../../api/axios";
import { vi } from "vitest";

vi.mock("../../api/axios");

const wrapper = ({ children }) => (
  <AuthProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </AuthProvider>
);

describe("PollList Filtering", () => {
  beforeEach(() => {
    api.get.mockResolvedValue({
      data: [
        {
          pollId: 1,
          title: "Movie Poll",
          description: "desc",
          isActive: true,
          expiresAt: new Date().toISOString(),
        },
        {
          pollId: 2,
          title: "Snack Choice",
          description: "desc",
          isActive: true,
          expiresAt: new Date().toISOString(),
        },
      ],
    });
  });

  test("search filters polls", async () => {
    render(<PollList />, { wrapper });

    const searchBox = await screen.findByPlaceholderText("Search polls...");

    fireEvent.change(searchBox, { target: { value: "Movie" } });

    expect(await screen.findByText("Movie Poll")).toBeInTheDocument();
    expect(screen.queryByText("Snack Choice")).not.toBeInTheDocument();
  });
});
