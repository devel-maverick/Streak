import { create } from "zustand";
import axiosInstance from "../api/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const usePlaygroundStore = create((set, get) => ({
    code: "",
    language: "cpp",
    input: "",
    output: null,
    isRunning: false,
    isAiGenerating: false,
    error: null,
    chatHistory: [],

    setLanguage: (language) => set({ language }),
    setCode: (code) => set({ code }),
    setInput: (input) => set({ input }),

    checkSubscription: () => {
    },

    runCode: async (code, language, input) => {
        set({ isRunning: true, error: null, output: null });
        try {
            const response = await axiosInstance.post("/playground/run", {
                code,
                language,
                input
            });
            set({ output: response.data, isRunning: false });
            toast.success("Code executed successfully");
            return response.data;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Execution failed";
            set({
                error: errorMsg,
                output: { stderr: errorMsg },
                isRunning: false
            });
            toast.error("Execution failed");
            return { stderr: errorMsg };
        }
    },

    analyzeCode: async (code, language) => {
        const user = useAuthStore.getState().user;
        if (!user || user.subscriptionPlan !== 'PRO') {
            set(state => ({
                chatHistory: [...state.chatHistory, {
                    role: 'ai', content: JSON.stringify({
                        complexity: "Locked Feature",
                        explanation: "AI Analysis is available only for Pro users. Please upgrade your subscription to unlock this feature.",
                        suggestions: ["Upgrade to Pro"]
                    })
                }],
                isAiGenerating: false
            }));
            return null;
        }

        set({ isAiGenerating: true, error: null });
        try {
            const response = await axiosInstance.post("/ai/analyze", { code, language, type: "time" });
            const aiResponse = response.data.analysis || response.data.message;
            set(state => ({
                chatHistory: [...state.chatHistory, { role: 'user', content: "Analyze my code" }, { role: 'ai', content: aiResponse }],
                isAiGenerating: false
            }));
            return aiResponse;
        } catch (error) {
            set({ error: "Analysis failed", isAiGenerating: false });
            return null;
        }
    },

    optimizeCode: async (code, language) => {
        const user = useAuthStore.getState().user;
        if (!user || user.subscriptionPlan !== 'PRO') {
            set(state => ({
                chatHistory: [...state.chatHistory, {
                    role: 'ai', content: JSON.stringify({
                        complexity: "Locked Feature",
                        explanation: "AI Optimization is available only for Pro users. Please upgrade your subscription to unlock this feature.",
                        suggestions: ["Upgrade to Pro"]
                    })
                }],
                isAiGenerating: false
            }));
            return null;
        }

        const { input, output } = get();
        set({ isAiGenerating: true, error: null });
        try {
            const response = await axiosInstance.post("/ai/improvement-suggestions", {
                code,
                language,
                output: typeof output === 'string' ? output : JSON.stringify(output),
                expectedOutput: ""
            });
            const data = response.data;
            let aiResponse = data.message || "No suggestions found.";

            if (data.suggestions && Array.isArray(data.suggestions)) {
                aiResponse = data.suggestions.map(s => `**${s.category}**: ${s.suggestion}`).join("\n\n");
            }

            set(state => ({
                chatHistory: [...state.chatHistory, { role: 'user', content: "Optimize my code" }, { role: 'ai', content: aiResponse }],
                isAiGenerating: false
            }));
            return aiResponse;
        } catch (error) {
            set({ error: "Optimization failed", isAiGenerating: false });
            return null;
        }
    },

    explainCode: async (code, language) => {
        const user = useAuthStore.getState().user;
        if (!user || user.subscriptionPlan !== 'PRO') {
            set(state => ({
                chatHistory: [...state.chatHistory, {
                    role: 'ai', content: JSON.stringify({
                        complexity: "Locked Feature",
                        explanation: "AI Explanation is available only for Pro users. Please upgrade your subscription to unlock this feature.",
                        suggestions: ["Upgrade to Pro"]
                    })
                }],
                isAiGenerating: false
            }));
            return null;
        }

        set({ isAiGenerating: true, error: null });
        try {
            const response = await axiosInstance.post("/ai/chat", {
                message: "Explain this code:\n" + code,
                context: { language }
            });
            let aiResponse = response.data.response || response.data.message;

            if (typeof aiResponse === 'object') {
                aiResponse = JSON.stringify(aiResponse, null, 2);
            }

            set(state => ({
                chatHistory: [...state.chatHistory, { role: 'user', content: "Explain this code" }, { role: 'ai', content: aiResponse }],
                isAiGenerating: false
            }));
            return aiResponse;
        } catch (error) {
            set({ error: "Explanation failed", isAiGenerating: false });
            return null;
        }
    },

    chatWithAI: async (message, context) => {
        const user = useAuthStore.getState().user;
        if (!user || user.subscriptionPlan !== 'PRO') {
            set(state => ({
                chatHistory: [...state.chatHistory, { role: 'user', content: message }, {
                    role: 'ai', content: JSON.stringify({
                        complexity: "Locked Feature",
                        explanation: "Chat limits reached. AI Chat is a Pro feature. Upgrade to continue.",
                        suggestions: ["Upgrade to Pro"]
                    })
                }],
                isAiGenerating: false
            }));
            return;
        }

        set({ isAiGenerating: true });
        set(state => ({ chatHistory: [...state.chatHistory, { role: 'user', content: message }] }));
        try {
            const response = await axiosInstance.post("/ai/chat", { message, context });
            const aiResponse = response.data.response;
            set(state => ({
                chatHistory: [...state.chatHistory, { role: 'ai', content: aiResponse }],
                isAiGenerating: false
            }));
        } catch (error) {
            set(state => ({
                chatHistory: [...state.chatHistory, { role: 'ai', content: "Error: Failed to get response." }],
                isAiGenerating: false
            }));
        }
    },

    clearChat: () => set({ chatHistory: [] })
}));