import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import { MemoryRouter } from "react-router-dom";
import TaskFormModal from "../../../../components/task_components/TaskFormModal"
import * as tasks from "../../../../api/tasks"

jest.mock("../../../../api/tasks");

describe("TaskFormModal", () => {
    test("Creates a new task and calls callbacks", async () => {
        tasks.createTask.mockResolvedValue({ id: 1 });
        const onClose = jest.fn();
        const onSaved = jest.fn();
        render(
        <MemoryRouter>
            <TaskFormModal onClose={onClose} onSaved={onSaved} projectId={1}/>
        </MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText("Task Title"), { target: { value: "New" } });
        fireEvent.submit(screen.getByText("Create").closest("form"));

        await waitFor(() => {
           expect(tasks.createTask).toHaveBeenCalled();
           expect(onSaved).toHaveBeenCalled();
           expect(onClose).toHaveBeenCalled();
        });
    });

    test("Edits when editData provided", async () => {
        tasks.editTask.mockResolvedValue({ id: 2 });
        const onClose = jest.fn();
        const onSaved = jest.fn();
        render(
        <MemoryRouter>
            <TaskFormModal onClose={onClose} onSaved={onSaved} projectId={1} editData={{ id: 2, title: "X", description: "" }} />
        </MemoryRouter>);
       
        fireEvent.submit(screen.getByText("Save").closest("form"));
        await waitFor(() => {
           expect(tasks.editTask).toHaveBeenCalled();
           expect(onSaved).toHaveBeenCalled();
           expect(onClose).toHaveBeenCalled();
        });
    });
});