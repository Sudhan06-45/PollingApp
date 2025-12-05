import api from "../../api/axios";

describe("API Interceptor", () => {
  test("adds Authorization header when token exists", async () => {
    localStorage.setItem("token", "TEST_TOKEN");

    const request = await api.interceptors.request.handlers[0].fulfilled({
      headers: {}
    });

    expect(request.headers.Authorization).toBe("Bearer TEST_TOKEN");
  });

  test("does NOT add Authorization header when no token", async () => {
    localStorage.removeItem("token");

    const request = await api.interceptors.request.handlers[0].fulfilled({
      headers: {}
    });

    expect(request.headers.Authorization).toBeUndefined();
  });
});
