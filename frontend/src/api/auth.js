import axios from "axios";
import client from "./client"

const oauthClient = axios.create({
    baseURL: "http://51.21.202.23:8000",
    headers: {"Content-Type": "application/x-www-form-urlencoded"}
});
oauthClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => { Promise.reject(error) });

export const login = async (username, password) =>
{
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    params.append("grant_type", "password");

    const response = await oauthClient.post("/auth/token", params.toString());
    return response.data;
}

export const register = async (payload) => 
{
    const response = await client.post("/auth/register", payload);
    return response.data;
}
export const requestReset = async (email) => (await client.post("/auth/reset/request", {email})).data;

export const confirmReset = async (token, newPassword) => (await client.post("/auth/reset/confirm", {token, new_passwd: newPassword})).data;