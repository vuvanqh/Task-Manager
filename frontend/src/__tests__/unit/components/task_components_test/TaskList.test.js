import { render, screen, fireEvent } from "@testing-library/react";
import TaskList from "../../../../components/task_components/TaskList";
import * as tasks from "../../../../api/tasks";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../../api/tasks");

describe("TaskList", () => {
  afterEach(() => jest.clearAllMocks());

  test("Renders tasks and completes task", async () => {
    tasks.getTasksForProject.mockResolvedValue([{ id: 1, title: "task1", status: "to-do" }]);
    tasks.completeTask.mockResolvedValue({ ok: true });

    render(
      <MemoryRouter>
        <TaskList projectId={1} onClick={() => {}} reload={() => {}} />
      </MemoryRouter>
    );
    expect(await screen.findByText("task1")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/complete/i));
    expect(tasks.completeTask).toHaveBeenCalledWith(1);
  });

  test("Shows no tasks message", async () => {
    tasks.getTasksForProject.mockResolvedValue([]);
    render(
      <MemoryRouter>
        <TaskList projectId={2} onClick={() => {}} reload={() => {}} />
      </MemoryRouter>
    );
    expect(await screen.findByText("No tasks yet")).toBeInTheDocument();
  });
});