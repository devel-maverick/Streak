import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../config/db.js";
import Groq from "groq-sdk";

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const groq = new Groq({ apiKey: process.env.Groq_API_KEY || "missing_api_key" });

const getModel = (modelName) => genAi.getGenerativeModel({ model: modelName || "gemini-2.5-flash" });

const generateContentWrapper = async (modelName, prompt) => {
    if (modelName && (modelName.includes("llama") || modelName.includes("mixtral") || modelName.includes("gemma"))) {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: modelName,
        });
        return { response: { text: () => chatCompletion.choices[0]?.message?.content || "" } };
    } else {
        const activeModel = getModel(modelName);
        return await activeModel.generateContent(prompt);
    }
};



{/* AI CHAT */ }

export const AIChat = async (req, res) => {
    try {
        const { message, problemId, language, code, input, output, model } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }
        let problemBody = ""
        if (problemId) {
            const problem = await prisma.problem.findUnique({
                where: {
                    id: problemId
                }
            })
            if (problem) {
                problemBody = `PROBLEM TITLE: ${problem.title}
                DESCRIPTION: ${problem.description}
                USER CODE: ${code}
                USER INPUT: ${input || "(none)"}
                USER OUTPUT: ${output || "(none)"}
                `

            }
        }
        const history = await prisma.aIMessage.findMany({
            where: {
                userId: req.user.id,
                problemId: problemId || null,
            },
            orderBy: { createdAt: "asc" },
            take: 20,
        });
        const historyText = history.map(item =>
            `[${item.role === "ai" ? "AI" : "User"}]: ${item.message}`
        ).join("\n");
        const prompt = `
    You are Streak AI — expert coding mentor.
    LANGUAGE: ${language || "unknown"}
    ${problemBody || "unknown problem"}
    PREVIOUS CHAT:
        ${historyText || "(none)"}
    USER MESSAGE:
        ${message}
    Reply Naturally and Concisely.
    `
        const result = await generateContentWrapper(model, prompt);
        const response = result.response.text().trim();
        await prisma.aIMessage.createMany({
            data: [
                { userId: req.user.id, problemId: problemId || null, role: "user", message: message },
                { userId: req.user.id, problemId: problemId || null, role: "ai", message: response },
            ],
        });
        return res.status(200).json({ message: response });

    } catch (err) {
        console.log("AI Error:", err);
        if (err.status === 429 || (err.message && err.message.includes("429"))) {
            return res.status(429).json({ message: "You are chatting too fast. Please wait a moment." });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



{/*TIME AND SPACE COMPLEXITY*/ }

export const AnalyzeRoute = async (req, res) => {
    try {
        const { type, code, language, model } = req.body;
        if (!code) {
            return res.status(400).json({ message: "Code is required" });
        }
        if (!type || (type !== "time" && type !== "space")) {
            return res.status(400).json({ message: "Invalid analyze type" });
        }
        let prompt = ""
        if (type === "time") {
            prompt = `
            Analyze TIME complexity.
            LANGUAGE: ${language || "unknown"}

            CODE:
            ${code}

            Return ONLY JSON:
            {
            "complexity":"",
            "explanation":"",
            "suggestions":[]
            }`;
        }

        if (type === "space") {
            prompt = `
            Analyze SPACE complexity.
            LANGUAGE: ${language || "unknown"}

            CODE:
            ${code}

            Return ONLY JSON:
            {
            "complexity":"",
            "explanation":"",
            "suggestions":[]
            }`;
        }
        const result = await generateContentWrapper(model, prompt);
        const response = result.response.text().replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
        return res.status(200).json({ message: response });

    } catch (err) {
        console.log(err);
        if (err.status === 429 || (err.message && err.message.includes("429"))) {
            return res.status(429).json({ message: "AI rate limit exceeded. Please try again later." });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const explainWrongOutputRoute = async (req, res) => {
    try {
        const { code, input, actualOutput, expectedOutput, language, model } = req.body;

        const prompt = `
User code produced WRONG output.
LANGUAGE: ${language || "unknown"}

CODE:
${code}

INPUT:
${input}

EXPECTED:
${expectedOutput}

ACTUAL:
${actualOutput}

Return ONLY JSON:
{
 "explanation":"",
 "suggestions":[]
}`;

        const result = await generateContentWrapper(model, prompt);

        const text = result.response.text()
            .replace(/^```(?:json)?\s*\n?/i, "")
            .replace(/\n?```\s*$/i, "")
            .trim();

        res.json({ success: true, ...JSON.parse(text) });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};


export const improvementSuggestionsRoute = async (req, res) => {
    try {
        const { code, output, expectedOutput, language, model } = req.body;

        const prompt = `
Give improvement suggestions.

LANGUAGE: ${language || "unknown"}

CODE:
${code}

OUTPUT:
${output}

EXPECTED:
${expectedOutput}

Return ONLY JSON:
{
 "totalSuggestions":0,
 "suggestions":[{ "category":"", "suggestion":"" }]
}`;

        const result = await generateContentWrapper(model, prompt);

        const text = result.response.text()
            .replace(/^```(?:json)?\s*\n?/i, "")
            .replace(/\n?```\s*$/i, "")
            .trim();

        res.json({ success: true, ...JSON.parse(text) });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};


export const getChatHistoryRoute = async (req, res) => {
    try {
        const { problemId } = req.query;

        const messages = await prisma.aIMessage.findMany({
            where: {
                userId: req.user.id,
                problemId: problemId || null,
            },
            orderBy: { createdAt: "asc" },
        });

        res.json({ success: true, messages });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};


export const clearChatHistoryRoute = async (req, res) => {
    try {
        const { problemId } = req.query;

        await prisma.aIMessage.deleteMany({
            where: {
                userId: req.user.id,
                problemId: problemId || null,
            },
        });

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};