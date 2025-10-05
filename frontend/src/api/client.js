import axios from "axios";

const API_URL = "/api" //"http://51.21.202.23:8000";
const client = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => { Promise.reject(error) });


export default client;