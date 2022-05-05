import axios from "axios";

const BASE_URL = "http://31.44.6.111:5000/api/lazynft"; 

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
        };
    }
};