import * as tasks from "../../../api/tasks";
import client from "../../../api/client";

jest.mock("../../../api/client", () =>
({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}));

describe("Tasks API", () => {
    afterEach( () => jest.clearAllMocks());

    test("getTasksForProject(): return tasks", async () => {
        client.get.mockResolvedValue({ data: { tasks: [{id:1 , title: "task"}]}});
        const data = await tasks.getTasksForProject(1);
        expect(client.get).toHaveBeenCalledWith("/projects/1/tasks");
        expect(data).toEqual( [{id:1, title:"task"}]);
    })

    test("getTask(): return task", async () => {
        client.get.mockResolvedValue({ data: {id:1 , title: "task"}});
        const data = await tasks.getTask(1,1);
        expect(client.get).toHaveBeenCalledWith("/projects/1/tasks/1");
        expect(data).toEqual({id:1, title:"task"});
    })

    test("createTask(): posts task", async () => {
        client.post.mockResolvedValue({data: {id:1}});
        let data = await tasks.createTask({title: "task"});
        expect(client.post).toHaveBeenCalledWith("/tasks", {title:"task"});
        expect(data).toEqual({id: 1});

        client.put.mockResolvedValue({ data: {id:1}});
        data = await tasks.editTask(1,{title:"task"});
        expect(client.put).toHaveBeenCalledWith("/tasks/1",{title: "task"});

        client.delete.mockResolvedValue({data: {ok:true}});
        data = await tasks.deleteTask(1);
        expect(client.delete).toHaveBeenCalledWith("/tasks/1");

        client.post.mockResolvedValue({data: {ok:true}});
        data = await tasks.assignTask(1);
        expect(client.post).toHaveBeenCalledWith("/tasks/1/assign");

        data = await tasks.completeTask(1);
        expect(client.post).toHaveBeenCalledWith("/tasks/1/complete");
    })
})