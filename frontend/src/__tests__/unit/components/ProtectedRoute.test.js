import { render } from "@testing-library/react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import jwtDecode from "jwt-decode";

jest.mock("jwt-decode", () => jest.fn());

describe("ProtectedRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("Redirects to login if no token", () => {
    localStorage.removeItem("token");
    const { container } = render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div>Secret</div></ProtectedRoute>} />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );
  
  });

  test("Allows when token and role matches", () => {
    localStorage.setItem("token", "token");
    jwtDecode.mockReturnValue({ role: "admin" });
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute roles={["admin"]}><div>Secret</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );
  });
});