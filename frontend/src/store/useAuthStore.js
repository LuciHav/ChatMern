import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';


export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isSignup: false,
    isLogging: false,
    isCheckingAuth: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });

        try {
            // Artificial delay for skeleton (1 second)
            await new Promise(resolve => setTimeout(resolve, 50));
            const res = await axiosInstance.get("/auth/protected");
            set({
                user: res.data,
                isAuthenticated: true
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false
            });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (credentials) => {
        set({ isLogging: true });
        try {
            const res = await axiosInstance.post("/auth/login", credentials);
            set({ user: res.data, isAuthenticated: true });
        } catch (err) {
            console.error("Login failed", err);
        } finally {
            set({ isLogging: false });
        }
    },

    logout: async () => {
        await axiosInstance.post("/auth/logout");
        set({ user: null, isAuthenticated: false });
    }
}));

// Add this named export for useAuth
export const useAuth = useAuthStore;

