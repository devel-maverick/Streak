import axios from "axios";
const JUDGE0_URL = process.env.JUDGE0_API_URL;

const Language_Map = {
    c: 50,
    cpp: 54,
    java: 62,
    python3: 71,
    python: 71,
    pypy3: 73,
    javascript: 63,
    csharp: 51,
    go: 60,
    rust: 73
}


export const getSupportedLanguages = () => {
    return Object.keys(Language_Map)
}



export const submitCode = async ({ code, language, input }) => {
    let languageId = Language_Map[language];
    let sourceCode = code;

    if (!languageId) {
        throw new Error("Invalid language");
    }

    const headers = {
        "Content-Type": "application/json",
        ...(process.env.JUDGE0_API_KEY && { "X-Auth-Token": process.env.JUDGE0_API_KEY }),
    };

    const { data } = await axios.post(`${JUDGE0_URL}/submissions`, {
        source_code: Buffer.from(sourceCode).toString("base64"),
        language_id: languageId,
        stdin: input ? Buffer.from(input).toString("base64") : null,
        cpu_time_limit: 10,
        wall_time_limit: 15,
    }, {
        params: {
            base64_encoded: "true",
            wait: "true",
            fields: "stdout,stderr,compile_output,exit_code,time,memory,status,token"
        },
        headers
    })
    return data;
}

export const getSubmissionResult = async (token) => {
    const { data } = await axios.get(`${JUDGE0_URL}/submissions/${token}`, {
        headers: {
            "Content-Type": "application/json",
            ...(process.env.JUDGE0_API_KEY && { "X-Auth-Token": process.env.JUDGE0_API_KEY }),
        },
        params: {
            base64_encoded: "true",
            fields: "stdout,stderr,compile_output,exit_code,time,memory,status"
        }
    })
    return parseResult(data);
}

const parseResult = (data) => ({
    status: data.status?.description || data.status?.name || "Unknown",
    statusId: data.status?.id,
    stdout: data.stdout ? Buffer.from(data.stdout, "base64").toString() : null,
    stderr: data.stderr ? Buffer.from(data.stderr, "base64").toString() : null,
    compile_output: data.compile_output ? Buffer.from(data.compile_output, "base64").toString() : null,
    exitCode: data.exit_code,
    time: data.time,
    memory: data.memory,
})

export const runCode = async ({ code, language, input }) => {
    try {
        const result = await submitCode({ code, language, input });

        if (result.status && result.status.id !== 1 && result.status.id !== 2) {
            return { token: result.token, ...parseResult(result) };
        }
        const token = result.token;
        const POLL_INTERVAL_MS = 1000;
        const MAX_POLLS = 60;

        for (let i = 0; i < MAX_POLLS; i++) {
            await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
            const pollResult = await getSubmissionResult(token);

            if (pollResult.statusId !== 1 && pollResult.statusId !== 2) {
                return { token, ...pollResult };
            }
        }

        return {
            token,
            status: "Time Limit Exceeded (polling timeout)",
            statusId: -1,
            stdout: null,
            stderr: "Execution timed out.",
            exitCode: null,
            time: null,
            memory: null,
        }

    } catch (error) {
        console.error("Judge0 Execution Error:", error.response?.data || error.message);
        throw error;
    }
}