// api.js
import axios from "axios";

const API_URL = "http://localhost:3003"; // پورت سرور رو با بک‌اندتون هماهنگ کنید

export const login = async (email, password) => {
    try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const response = await axios.post(`${API_URL}/api/login`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status === 200 && response.data.token) {
            return response;
        } else {
            throw new Error("Login failed");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const register = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/register`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
};

export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};
export const getTopSellingProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products/top-selling`);
        return response.data;
    } catch (error) {
        console.error("Error fetching top-selling products:", error);
        throw error;
    }
};

export const getMostViewedProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products/most-viewed`);
        return response.data;
    } catch (error) {
        console.error("Error fetching most-viewed products:", error);
        throw error;
    }
};

export const getBudgetFriendlyProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products/budget-friendly`);
        return response.data;
    } catch (error) {
        console.error("Error fetching budget-friendly products:", error);
        throw error;
    }
};
export const addProduct = async (productData) => {
    try {
        const response = await axios.post(`${API_URL}/api/add-product`, productData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};