// middleware/verifyToken.js
import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
    const auth = req.headers.authorization; // expects "Bearer <token>"
    if (!auth) return res.status(401).json({ message: "No token" });

    const [scheme, token] = auth.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Bad authorization format" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.userId, email: payload.email };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
