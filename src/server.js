import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
// Create PG session store using the pool
import PgSession from "connect-pg-simple";
const pgSession = PgSession(session);
import passport from "./config/passport.js";
import pkg from "pg";
const { Pool } = pkg;
// import prisma from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";

dotenv.config();
const app = express();
// const prisma = new PrismaClient();

// Create PostgreSQL pool for sessions
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Same as the DATABASE_URL in .env
});

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5000", // Adjust to your frontend URL
        credentials: true, // Allow cookies to be sent
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        store: new pgSession({
            pool: pool, // Use the connection pool from pg
            tableName: "session", // Session table name
        }),
        secret: process.env.SESSION_SECRET || "supersecret",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // Use secure: true for production
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log("Session Data:", req.session);
    console.log("User Data:", req.user);
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
