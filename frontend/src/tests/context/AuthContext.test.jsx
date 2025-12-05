import { renderHook, act } from "@testing-library/react";
import { AuthProvider } from "../../context/AuthContext";
import useAuth from "../../hooks/useAuth";

describe("AuthContext", () => {
  test("login stores user + token", () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

    const { result } = renderHook(() => useAuth(), { wrapper });

    const userData = { id: 1, role: "Voter", email: "sudhan@gmail.com" };

    act(() => {
      result.current.login("JWT_TOKEN", userData);
    });

    expect(result.current.token).toBe("JWT_TOKEN");
    expect(result.current.user.email).toBe("sudhan@gmail.com");
    expect(localStorage.getItem("token")).toBe("JWT_TOKEN");
  });

  test("logout clears everything", () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBe(null);
    expect(localStorage.getItem("token")).toBe(null);
  });
});
