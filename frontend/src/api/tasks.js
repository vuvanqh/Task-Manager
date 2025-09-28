import client from "./client.js";

export const getTasksForProject = async (projectId) => (await client.get(`/projects/${projectId}/tasks`)).data.tasks || [];
export const getTask = async(projectId, taskId) => (await client.get(`/projects/${projectId}/tasks/${taskId}`)).data
export const createTask = async (payload) => (await client.post("/tasks", payload)).data;
export const editTask = async (id, payload) => (await client.put(`/tasks/${id}`, payload)).data;
export const deleteTask = async (id) => (await client.delete(`/tasks/${id}`)).data;
export const assignTask = async (taskId) => (await client.post(`/tasks/${taskId}/assign`)).data; //error here
export const completeTask = async (taskId) => (await client.post(`/tasks/${taskId}/complete`)).data;