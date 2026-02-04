import jwt from "jsonwebtoken"

const GenerateToken = async (user, res) => {
    const payload = {
        id: user.id,
        email: user.email
    }
    const Jwt = process.env.JWT_SECRET
    if (!Jwt) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign(payload, Jwt, { expiresIn: '1h' })
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return token
}

export default GenerateToken
