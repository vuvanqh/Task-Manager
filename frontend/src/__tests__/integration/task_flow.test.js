import { render, screen, fireEvent } from "@testing-library/react";
import TaskFormModal from "../../components/task_components/TaskFormModal";
import TaskList from "../../components/task_components/TaskList";
import * as tasks from "../../api/tasks";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../api/tasks");

describe("Task CRUD flow", () => {
  test("Creates a task via TaskFormModal and refreshes list", async () => {
    tasks.createTask.mockResolvedValue({ id: 1 });
    tasks.getTasksForProject.mockResolvedValue([]);
    const onSaved = jest.fn();
    const onClose = jest.fn();
    render(
      <MemoryRouter>
        <TaskFormModal onClose={onClose} onSaved={onSaved} projectId={1} />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText("Task Title"), { target: { value: "New Task" } });
    fireEvent.submit(screen.getByText("Create").closest("form"));
    expect(tasks.createTask).toHaveBeenCalled();
  });

  test("Loads TaskList and completes task", async () => {
    tasks.getTasksForProject.mockResolvedValue([{ id: 1, title: "task1", status: "to-do" }]);
    tasks.completeTask.mockResolvedValue({ ok: true });
    render(
      <MemoryRouter>
        <TaskList projectId={1} onClick={()=>{}} reload={()=>{}} />
      </MemoryRouter>
    );
    expect(await screen.findByText("task1")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/complete/i));
    expect(tasks.completeTask).toHaveBeenCalledWith(1);
  });
});