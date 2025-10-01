import {render, screen} from "@testing-library/react"
import { MemoryRouter } from "react-router-dom";
import TopNav from "../../../components/TopNav"

describe("TopNav", () => {
    beforeEach(() => localStorage.clear());

    test("Shows username and admin link provided admin role", () => {
        const user = { username: "admin", role: "admin"};
        render(
        <MemoryRouter>
            <TopNav user={user} onLogout={()=>{}}></TopNav>
        </MemoryRouter>);
        expect(screen.getByText("admin")).toBeInTheDocument();
        expect(screen.getByText("Projects")).toBeInTheDocument();
        expect(screen.getByText("Admin")).toBeInTheDocument();
    });
    
    test("Does not show admin link whitout being provided admin role", () => {
        const user1 = { username: "user1", role: "manager"};
        const user2 = { username: "user2", role: "user"};
        render(
        <MemoryRouter>
            <TopNav user={user1} onLogout={()=>{}}></TopNav>
            <TopNav user={user2} onLogout={()=>{}}></TopNav>
        </MemoryRouter>);
        expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    })

    test("Calls log out if token is missing", () => {
        const user1 = { username: "user1", role: "manager"};
        const fn = jest.fn();
        localStorage.removeItem("token");
        render(
        <MemoryRouter>
            <TopNav user={user1} onLogout={fn}></TopNav>
        </MemoryRouter>);
        expect(fn).toHaveBeenCalled();
    })
})