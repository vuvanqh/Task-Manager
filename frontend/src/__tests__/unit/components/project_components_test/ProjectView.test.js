import { render, screen, fireEvent } from "@testing-library/react";
import ProjectView from "../../../../components/project_components/ProjectView";
import * as projects from "../../../../api/projects";
import { MemoryRouter, Routes, Route } from "react-router-dom";

jest.mock("../../../../api/projects");

describe("ProjectView", () => {
  test("Loads and shows project", async () => {
    projects.getProject.mockResolvedValue({ id: 1, name: "Project1", description: "description" });
    render(
      <MemoryRouter initialEntries={["/projects/1"]}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectView />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText("Project1")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
  });


});