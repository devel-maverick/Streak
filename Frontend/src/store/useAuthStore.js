import { create } from "zustand";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    user: null,
    isLoading: false,
    isCheckingAuth: true,
    error: null,
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axiosInstance.get("/auth/me");
            set({ user: response.data.user, isCheckingAuth: false });
        } catch (error) {
            set({ user: null, isCheckingAuth: false });
        }
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/auth/login", credentials);
            set({ user: response.data, isLoading: false });
            return { success: true };
        } catch (error) {
            set({
                error: error.response?.data?.message || "Login failed",
                isLoading: false
            });
            toast.error(error.response?.data?.message || "Login failed");
            return { success: false, error: error.response?.data?.message };
        }
    },

    register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/auth/register", credentials);
            set({ user: response.data, isLoading: false });
            toast.success("Registration successful");
            return { success: true };
        } catch (error) {
            set({
                error: error.response?.data?.message || "Registration failed",
                isLoading: false
            });
            toast.error(error.response?.data?.message || "Registration failed");
            return { success: false, error: error.response?.data?.message };
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null, isLoading: false });
            toast.success("Logged out successfully");
        } catch (error) {
            set({
                error: error.response?.data?.message || "Logout failed",
                isLoading: false
            });
            toast.error("Logout failed");
        }
    }
}));