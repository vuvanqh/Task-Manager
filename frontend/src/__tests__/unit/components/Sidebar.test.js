import {render, screen, fireEvent} from "@testing-library/react"
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../../../components/Sidebar"
import * as projects from "../../../api/projects"

jest.mock("../../../api/projects");

describe("Sidebar", () => {
    beforeEach(()=>jest.clearAllMocks());

    test("Loads and renders projects and filters properly", async () => {
        projects.getProjects.mockResolvedValue([{ id:1, name:"Project1"}, {id:2, name:"2Project"}]);
        render(
            <MemoryRouter>
                <Sidebar selectedID={1} onSelect={()=>{}} onCreateClick={()=>{}}/>
            </MemoryRouter>
        )
        expect(await screen.findByText("Project1")).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText("Filter..."),{target: {value:"P"}});
        expect(await screen.findByText("Project1")).toBeInTheDocument();
    })
})