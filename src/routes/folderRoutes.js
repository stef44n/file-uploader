import express from "express";
import prisma from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Create a folder
router.post("/", verifyToken, async (req, res) => {
    const { name } = req.body;
    try {
        const folder = await prisma.folder.create({
            data: { name, userId: req.user.id },
        });
        res.json(folder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating folder" });
    }
});

// Get all folders for logged-in user
router.get("/", verifyToken, async (req, res) => {
    try {
        const folders = await prisma.folder.findMany({
            where: { userId: req.user.id },
            include: { files: true }, // Include files inside folders
        });
        res.json(folders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching folders" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const folder = await prisma.folder.findUnique({
            where: { id },
            include: { files: true }, // Include files inside the folder
        });

        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        res.json(folder);
    } catch (error) {
        console.error("Error fetching folder:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all files in a specific folder
router.get("/:folderId/files", async (req, res) => {
    const { folderId } = req.params;

    try {
        const files = await prisma.file.findMany({
            where: { folderId: folderId }, // Get files only in this folder
        });

        res.json(files);
    } catch (error) {
        console.error("Error fetching files in folder:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Update folder name
router.put("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const folder = await prisma.folder.update({
            where: { id, userId: req.user.id },
            data: { name },
        });
        res.json(folder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating folder" });
    }
});

// Delete a folder
router.delete("/:id", verifyToken, async (req, res) => {
    const folderId = req.params.id; // UUID

    try {
        // Delete all files in the folder
        await prisma.file.deleteMany({
            where: {
                folderId: folderId,
            },
        });

        // Then delete the folder
        await prisma.folder.delete({
            where: {
                id: folderId,
            },
        });

        res.status(200).json({ message: "Folder and its files deleted." });
    } catch (error) {
        console.error("Error deleting folder and its files:", error);
        res.status(500).json({ error: "Failed to delete folder and files." });
    }
});

export default router;
