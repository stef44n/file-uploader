import express from "express";
import passport from "../config/passport.js";
import bcrypt from "bcrypt";
import prisma from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

// Login → issue a token instead of session cookie
router.post("/login", passport.authenticate("local"), async (req, res) => {
    const user = req.user;
    // Sign a token with user ID (and maybe email), expires in e.g. 1h
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.json({ token, user: { id: user.id, email: user.email } });
});

// Logout
router.post("/logout", (req, res) => {
    req.logout(() => {
        res.json({ message: "Logged out successfully" });
    });
});

// Check authentication
router.get("/me", async (req, res) => {
    console.log("Headers:", req.headers); // Check if cookie is sent
    console.log("Cookies:", req.headers.cookie); // Debugging cookies
    console.log("Session Data:", req.session);

    if (!req.session?.passport?.user) {
        console.log("🚨 No passport user found in session");
        return res.status(401).json({ message: "Not authenticated" });
    }

    console.log("Stored User ID:", req.session.passport.user);

    const user = await prisma.user.findUnique({
        where: { id: req.session.passport.user },
    });

    if (!user) {
        console.log("❌ User not found in database");
        return res.status(401).json({ message: "User not found" });
    }

    console.log("✅ Returning authenticated user:", user);
    res.json({ user });
});

router.get("/debug-session", (req, res) => {
    console.log("Cookies:", req.cookies);
    console.log("Session:", req.session);
    res.json({ session: req.session });
});

export default router;
