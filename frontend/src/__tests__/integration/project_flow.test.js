import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProjectView from "../../components/project_components/ProjectView";
import TaskList from "../../components/task_components/TaskList";
import * as projects from "../../api/projects";
import * as tasks from "../../api/tasks";

jest.mock("../../api/projects");
jest.mock("../../api/tasks");

describe("Project -> Tasks integration", () => {
  beforeEach(() => {
    projects.getProject.mockResolvedValue({ id: 1, name: "Project1", description: "description" });
    tasks.getTasksForProject.mockResolvedValue([{ id: 1, title: "task1", status: "to-do" }]);
    tasks.completeTask.mockResolvedValue({ ok: true });
  });

  test("Renders project then tasks and marks complete", async () => {
    render(
      <MemoryRouter initialEntries={["/projects/1"]}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectView />}>
            <Route index element={<TaskList projectId={1} onClick={()=>{}} reload={()=>{}} />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Project1")).toBeInTheDocument();
    expect(await screen.findByText("task1")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/complete/i));
    expect(tasks.completeTask).toHaveBeenCalledWith(1);
  });
});