import axios from "axios";
import { clearAuthSession } from "./authStorage";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

// Check for any auth-related error messages
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        const isAuthError =
            status === 401 ||
            status === 403 ||
            [
                "Invalid token.",
                "Access denied. No token provided.",
                "jwt expired",
                "Unauthorized",
            ].includes(message);

        if (isAuthError) {
            clearAuthSession();
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
