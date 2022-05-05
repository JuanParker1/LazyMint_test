import axios from "axios";

const BASE_URL = "http://localhost:5000/api/lazyNFT"; 
// const BASE_URL = "https://saliks-discord.herokuapp.com/";

const api = axios.create({
    baseURL: BASE_URL
});

// api.interceptors.request.use(
//     (config) => {
//         config.headers!["Authorization"] = `Bearer ${token}`;
//         return config;
//     },
//     (err) => {
//         return Promise.reject(err);
//     }
// );

export const createLazyNFT = async (data) => {
    try {
        const res = await api.post("/create", data);
        return res.data;
    } catch (err) {
        return {
            error: true,
            message: err.response.data,
        };
    }
};

export const updateNFT = async (data) => {
    try {
        const res = await api.post("/update", data);
        return res.data;
    } catch (err) {
        return {
            error: true,
            message: err.response.data,
        };
    }
};

export const getNFTs = async () => {
    try {
        const res = await api.post("/get");
        return res.data;
    } catch (err) {
        return {
            error: true,
            message: err.response.data,
        };
    }
};