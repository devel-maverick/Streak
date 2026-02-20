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
    selectedModel: "gemini-2.5-flash",

    setSelectedModel: (model) => set({ selectedModel: model }),

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

    analyzeCode: async (code, language, type) => {
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

        if (!code || !code.trim()) {
            toast.error("Please enter some code to analyze");
            return null;
        }

        const promptType = type === 'time' ? "Analyze time complexity" : "Analyze space complexity";

        set(state => ({
            isAiGenerating: true,
            error: null,
            chatHistory: [...state.chatHistory, { role: 'user', content: promptType }]
        }));

        try {
            const { selectedModel } = get();
            const response = await axiosInstance.post("/ai/analyze", { code, language, type, model: selectedModel });
            const aiResponse = response.data.analysis || response.data.message;
            set(state => ({
                chatHistory: [...state.chatHistory, { role: 'ai', content: aiResponse }],
                isAiGenerating: false
            }));
            return aiResponse;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Analysis failed";
            set(state => ({
                error: errorMsg,
                isAiGenerating: false,
                chatHistory: [...state.chatHistory, { role: 'ai', content: `Error: ${errorMsg}` }]
            }));
            toast.error(errorMsg);
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

        if (!code || !code.trim()) {
            toast.error("Please enter some code to optimize");
            return null;
        }

        const { input, output } = get();
        set(state => ({
            isAiGenerating: true,
            error: null,
            chatHistory: [...state.chatHistory, { role: 'user', content: "Optimize my code" }]
        }));

        try {
            const { selectedModel } = get();
            const response = await axiosInstance.post("/ai/improvement-suggestions", {
                code,
                language,
                output: typeof output === 'string' ? output : JSON.stringify(output),
                expectedOutput: "",
                model: selectedModel
            });
            const data = response.data;
            let aiResponse = data.message || "No suggestions found.";

            if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
                aiResponse = data.suggestions.map(s => `**${s.category}**: ${s.suggestion}`).join("\n\n");
            }

            set(state => ({
                chatHistory: [...state.chatHistory, { role: 'ai', content: aiResponse }],
                isAiGenerating: false
            }));
            return aiResponse;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Optimization failed";
            set(state => ({
                error: errorMsg,
                isAiGenerating: false,
                chatHistory: [...state.chatHistory, { role: 'ai', content: `Error: ${errorMsg}` }]
            }));
            toast.error(errorMsg);
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

        if (!code || !code.trim()) {
            toast.error("Please enter some code to explain");
            return null;
        }

        set(state => ({
            isAiGenerating: true,
            error: null,
            chatHistory: [...state.chatHistory, { role: 'user', content: "Explain this code" }]
        }));

        try {
            const { selectedModel } = get();
            const response = await axiosInstance.post("/ai/chat", {
                message: "Explain this code:\n" + code,
                context: { language },
                model: selectedModel
            });
            let aiResponse = response.data.response || response.data.message;

            if (typeof aiResponse === 'object') {
                aiResponse = JSON.stringify(aiResponse, null, 2);
            }

            set(state => ({
                chatHistory: [...state.chatHistory, { role: 'ai', content: aiResponse }],
                isAiGenerating: false
            }));
            return aiResponse;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Explanation failed";
            set(state => ({
                error: errorMsg,
                isAiGenerating: false,
                chatHistory: [...state.chatHistory, { role: 'ai', content: `Error: ${errorMsg}` }]
            }));
            toast.error(errorMsg);
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
            const { selectedModel } = get();
            const response = await axiosInstance.post("/ai/chat", { message, context, model: selectedModel });
            const aiResponse = response.data.response || response.data.message;
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