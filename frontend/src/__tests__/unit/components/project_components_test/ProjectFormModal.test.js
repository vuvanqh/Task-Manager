import {render, screen, fireEvent} from "@testing-library/react"
import { MemoryRouter } from "react-router-dom";
import ProjectFormModal from "../../../../components/project_components/ProjectFormModal"
import * as projects from "../../../../api/projects"

jest.mock("../../../../api/projects");

describe("ProjectFormModal", () => {
    beforeEach(()=>jest.clearAllMocks());

    test("Creates a new project and calls callbacks", async () => {
        projects.createProject.mockResolvedValue({ id: 1 });
        const onClose = jest.fn();
        const onSaved = jest.fn();
        render(
        <MemoryRouter>
            <ProjectFormModal onClose={onClose} onSaved={onSaved} />
        </MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText("Project Name"), { target: { value: "New" } });
        fireEvent.submit(screen.getByText("Create").closest("form"));
    });

    test("Edits when editData provided", async () => {
        projects.editProject.mockResolvedValue({ id: 2 });
        const onClose = jest.fn();
        const onSaved = jest.fn();
        render(
        <MemoryRouter>
            <ProjectFormModal onClose={onClose} onSaved={onSaved} editData={{ id: 2, name: "X", description: "" }} />
        </MemoryRouter>);
       
        fireEvent.submit(screen.getByText("Save").closest("form"));
    });
});