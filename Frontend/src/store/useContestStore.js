import { create } from "zustand";
import axiosInstance from "../api/axios";


export const useContestStore = create((set, get) => ({
    contests: [],
    isLoading: false,
    error: null,
    selectedPlatform: "ALL",
    setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
    fetchContests: async () => {
        set({ isLoading: true, error: null })
        try {
            const data = await axiosInstance.get("/contests")
            set({ contests: data.data, isLoading: false })

        } catch (err) {
            console.error("Failed to fetch contests:", err);
            set({
                error: err.response?.data?.message || "Failed to fetch contests",
                isLoading: false,
            });
        }
    }
    ,
    getFilteredContests: () => {
        const { contest, selectedPlatform } = get()
        if (selectedPlatform === "ALL") return contest
        return contest.filter((c) => c.platform === selectedPlatform)
    }
    ,
    getContestsByDate: (dateStr) => {
        const { getFilteredContests } = get()
        return getFilteredContests().filter((c) => {
            const contestDate = new Date(c.startTime).toDateString();
            return contestDate === dateStr;
        })
    }

}))
