import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../../pages/common/Login.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";

describe("Login Page", () => {
  const wrapper = ({ children }) => (
    <AuthProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </AuthProvider>
  );

  test("renders Login title", () => {
    render(<Login />, { wrapper });
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
  });

  test("shows password on clicking eye icon", () => {
    render(<Login />, { wrapper });

    const passwordField = screen.getByPlaceholderText("Enter your password");
    const toggleBtn = screen.getByTestId("toggle-password");

    fireEvent.click(toggleBtn);

    expect(passwordField.type).toBe("text");
  });
});
