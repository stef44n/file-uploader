import { useState, useEffect } from "react";
import axios from "axios";

const FolderList = ({
    folders,
    onSelect,
    refreshFolders,
    fetchFiles,
    setFiles,
    selectedFolderId,
}) => {
    const [newFolderName, setNewFolderName] = useState("");
    const [renameInput, setRenameInput] = useState("");
    const [showNewFolderInput, setShowNewFolderInput] = useState(false);
    const [showRenameInput, setShowRenameInput] = useState(false);

    const createFolder = async () => {
        if (!newFolderName.trim()) return;
        try {
            const { data } = await axios.post("/api/folders", {
                name: newFolderName,
            });
            refreshFolders();
            setNewFolderName(""); // Reset input after creation
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    };

    const renameFolder = async (id, newName) => {
        if (!newName.trim()) return;
        await axios.put(`/api/folders/${id}`, { name: newName });
        refreshFolders();
    };

    const handleRename = async () => {
        if (!renameInput.trim() || !selectedFolderId) return;

        try {
            await axios.put(`/api/folders/${selectedFolderId}`, {
                name: renameInput,
            });

            await refreshFolders(); // Refresh after renaming
            // setRenameInput(""); // Clear input
        } catch (error) {
            console.error("Error renaming folder:", error);
        }
    };

    const deleteFolder = async (id) => {
        if (!window.confirm("Delete this folder?")) return;
        await axios.delete(`/api/folders/${id}`);
        refreshFolders();
    };

    const handleSelectFolder = (folder) => {
        onSelect(folder); // Set the selected folder
        fetchFiles(folder.id); // Fetch files when folder is selected
        setRenameInput(folder.name); // Pre-fill rename input with the current folder name
        setShowNewFolderInput(false); // Hide folder creation UI
        setNewFolderName(""); // Clear input field
    };

    const createFolderWrapper = async () => {
        await createFolder(); // your existing createFolder function
        setNewFolderName("");
        setShowNewFolderInput(false);
    };

    return (
        <div>
            {/* Create Folder input only shown when no folder is selected */}
            {!selectedFolderId && (
                <div style={{ marginTop: "1rem" }}>
                    {!showNewFolderInput ? (
                        <button onClick={() => setShowNewFolderInput(true)}>
                            ➕ Add New Folder
                        </button>
                    ) : (
                        <div>
                            <input
                                type="text"
                                placeholder="New folder name"
                                value={newFolderName}
                                onChange={(e) =>
                                    setNewFolderName(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        createFolderWrapper();
                                    }
                                }}
                            />
                            <button onClick={createFolderWrapper}>
                                ✔ Create
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewFolderInput(false);
                                    setNewFolderName("");
                                }}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Folder List */}
            {!selectedFolderId && (
                <ul>
                    {folders.map((folder) => (
                        <li key={folder.id}>
                            <button onClick={() => handleSelectFolder(folder)}>
                                {folder.name} 📂
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Folder CRUD operations */}
            {selectedFolderId && (
                <div style={{ marginTop: "1rem" }}>
                    <button
                        onClick={() => {
                            onSelect(null); // Deselect folder
                            setShowRenameInput(false); // Reset rename UI
                        }}
                    >
                        ↶ Back
                    </button>

                    {!showRenameInput ? (
                        <button onClick={() => setShowRenameInput(true)}>
                            ✏️ Rename Folder
                        </button>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={renameInput}
                                onChange={(e) => setRenameInput(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    handleRename();
                                    setShowRenameInput(false);
                                }}
                            >
                                ✔ Confirm
                            </button>
                            <button
                                onClick={() => {
                                    setShowRenameInput(false);
                                    // setRenameInput(""); // Optional: reset input
                                }}
                            >
                                ❌ Cancel
                            </button>
                        </>
                    )}

                    <button onClick={() => deleteFolder(selectedFolderId)}>
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default FolderList;
