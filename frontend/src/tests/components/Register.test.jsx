import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../../pages/common/Register";

describe("Register Page", () => {
  const wrapper = ({ children }) => (
    <BrowserRouter>{children}</BrowserRouter>
  );

  test("password confirmation mismatch shows error", () => {
    render(<Register />, { wrapper });

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "john@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "Test@123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Re-enter password"), {
      target: { value: "WrongPassword" },
    });

    fireEvent.click(screen.getByText("Register"));

    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
  });
});
