import client from "./client";

export const getProjects = async () => (await client.get("/projects")).data.projects || [];
export const getProject = async(id) => (await client.get(`/projects/${id}`)).data;
export const createProject = async (payload) => (await client.post("/projects", payload)).data;
export const editProject = async (id, payload) => (await client.put(`/projects/${id}`, payload)).data;
export const deleteProject = async (id) => (await client.delete(`/projects/${id}`)).data;