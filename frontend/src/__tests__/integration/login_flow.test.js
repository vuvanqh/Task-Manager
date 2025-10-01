import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../../pages/LoginPage";
import * as auth from "../../api/auth";
import { MemoryRouter, Routes, Route } from "react-router-dom";

jest.mock("../../api/auth");

describe("Login flow", () => {
  afterEach(() => jest.clearAllMocks());

  test("Logs in and stores token & username", async () => {
    auth.login.mockResolvedValue({ access_token: "token" });
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/projects" element={<div>Projects Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "u" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "p" } });
    fireEvent.click(screen.getByText("Login", { selector: "button" }));

    expect(auth.login).toHaveBeenCalledWith("u", "p");
  });
});