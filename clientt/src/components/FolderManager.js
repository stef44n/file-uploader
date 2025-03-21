import { useState, useEffect } from "react";
import axios from "axios";

const FolderManager = () => {
    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState("");
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [renameInputs, setRenameInputs] = useState({});

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const { data } = await axios.get("/api/folders");

            // Sort by createdAt (oldest first)
            const sortedFolders = data.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );

            setFolders(sortedFolders);
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    };

    const createFolder = async () => {
        if (!newFolderName.trim()) return;
        try {
            const { data } = await axios.post("/api/folders", {
                name: newFolderName,
            });
            setFolders([...folders, data]);
            setNewFolderName("");
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    };

    const deleteFolder = async (folderId) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this folder?"
        );
        if (!isConfirmed) return;
        try {
            await axios.delete(`/api/folders/${folderId}`);
            setFolders(folders.filter((folder) => folder.id !== folderId));
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
    };

    const handleRenameChange = (folderId, newName) => {
        setRenameInputs((prev) => ({
            ...prev,
            [folderId]: newName, // Only update the input for the specific folder
        }));
    };

    const handleRename = async (folderId) => {
        if (!renameInputs[folderId]) return; // Prevent empty renames
        try {
            await axios.put(`/api/folders/${folderId}`, {
                name: renameInputs[folderId],
            });
            setRenameInputs((prev) => {
                const updatedInputs = { ...prev };
                delete updatedInputs[folderId]; // Clear input for this folder after renaming
                return updatedInputs;
            });
            fetchFolders(); // Refresh list
        } catch (error) {
            console.error("Error renaming folder:", error);
        }
    };

    return (
        <div>
            <h2>Folders</h2>
            <ul>
                {folders.map((folder) => (
                    <li key={folder.id}>
                        <span onClick={() => setSelectedFolder(folder)}>
                            {folder.name}
                        </span>
                        <button onClick={() => deleteFolder(folder.id)}>
                            Delete
                        </button>
                        <input
                            type="text"
                            placeholder="New name"
                            value={renameInputs[folder.id] || ""}
                            onChange={(e) =>
                                handleRenameChange(folder.id, e.target.value)
                            }
                        />
                        <button onClick={() => handleRename(folder.id)}>
                            Rename
                        </button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="New folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
            />
            <button onClick={createFolder}>Create Folder</button>
        </div>
    );
};

export default FolderManager;
