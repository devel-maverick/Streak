import { validateRequiredFields, isValidLanguage } from "../utils/validator.js";
import { runCode } from "../../services/judge0.service.js";

export const run = async (req, res) => {
    try {
        const { code, language, input } = req.body
        const missing = validateRequiredFields(["code", "language"], req.body)
        if (missing.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` })
        }
        if (!isValidLanguage(language)) {
            return res.status(400).json({ message: "Invalid language" })
        }
        if (code.trim().length === 0) {
            return res.status(400).json({ message: "Code cannot be empty" })
        }
        const result = await runCode({ code, language, input: input || "" })
        return res.status(200).json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Code execution failed", error: err.message, details: err.response?.data })
    }
}