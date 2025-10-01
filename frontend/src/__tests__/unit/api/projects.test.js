import * as projects from "../../../api/projects";
import client from "../../../api/client";

jest.mock("../../../api/client", () =>
({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}));

describe("Projects API", () => {
    afterEach(()=> jest.clearAllMocks());

    test("getProjects(): returns projects array", async () => {
        client.get.mockResolvedValue({ data: {projects: [{id:1, name:"project"}]}});
        const data = await projects.getProjects();
        expect(client.get).toHaveBeenCalledWith("/projects");
        expect(data).toEqual([{id:1, name:"project"}]);
    })

    test("getProject(): returns a single project data", async () => {
        client.get.mockResolvedValue({data: {id: 1, name: "project"}});
        const data = await projects.getProject(1);
        expect(client.get).toHaveBeenCalledWith("/projects/1");
        expect(data).toEqual({id:1, name: "project"});
    })

    test("createProject(): posts payload", async () => {
        client.post.mockResolvedValue({ data: { id: 2}});
        const data = await projects.createProject({name: "project"});
        expect(client.post).toHaveBeenCalledWith("/projects", {name: "project"});
        expect(data).toEqual({id:2});
    })

    test("editProject(): puts payload", async () => {
        client.put.mockResolvedValue({data: {id: 3}});
        const data = await projects.editProject(3, {name: "edited_project"});
        expect(client.put).toHaveBeenCalledWith("/projects/3", {name: "edited_project"});
        expect(data).toEqual({id:3});
    })

    test("deleteProject(): deletes the project", async () => {
        client.delete.mockResolvedValue({data: {ok: true}});
        const data = await projects.deleteProject(3);
        expect(client.delete).toHaveBeenCalledWith("/projects/3");
        expect(data).toEqual({ok: true});
    })
})