import jwt from "jsonwebtoken"
export const Protected = async (req, res, next) => {
    try {
        let token = req.cookies?.token
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1]
        }
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

