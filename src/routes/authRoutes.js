import express from "express";
import passport from "../config/passport.js";
import bcrypt from "bcrypt";
import prisma from "../config/db.js";

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

// Login
router.post("/login", passport.authenticate("local"), (req, res) => {
    req.login(req.user, (err) => {
        if (err) {
            console.error("❌ Error logging in:", err);
            return res.status(500).json({ message: "Login failed" });
        }

        req.session.passport = { user: req.user.id }; // Manually attach user ID
        req.session.save((err) => {
            if (err) {
                console.error("❌ Error saving session:", err);
                return res.status(500).json({ message: "Session error" });
            }

            console.log("✅ Session saved:", req.session);
            console.log("🔹 Sending session cookie now...");

            res.json({ message: "Logged in successfully", user: req.user });
        });
    });
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
    console.log("Cookies:", req.cookies); // Debugging cookies
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

export default router;
