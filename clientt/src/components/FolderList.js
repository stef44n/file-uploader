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

    // const renameFolder = async (id, newName) => {
    //     if (!newName.trim()) return;
    //     await axios.put(`/api/folders/${id}`, { name: newName });
    //     refreshFolders();
    // };

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
        onSelect(null);
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
        <div style={{ marginBottom: "2rem" }}>
            {/* Create Folder UI */}
            {!selectedFolderId && (
                <div style={{ marginTop: "1rem" }}>
                    {!showNewFolderInput ? (
                        <button
                            onClick={() => setShowNewFolderInput(true)}
                            style={{
                                padding: "0.5rem 1rem",
                                fontSize: "1rem",
                                borderRadius: "6px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            ➕ Add New Folder
                        </button>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                marginTop: "0.5rem",
                            }}
                        >
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
                                style={{
                                    flex: 1,
                                    padding: "0.5rem",
                                    fontSize: "1rem",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                }}
                            />
                            <button
                                onClick={createFolderWrapper}
                                style={{
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                ✔ Create
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewFolderInput(false);
                                    setNewFolderName("");
                                }}
                                style={{
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "none",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "6px",
                                    cursor: "pointer",
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
                <ul
                    style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}
                >
                    {folders.map((folder) => (
                        <li key={folder.id} style={{ marginBottom: "0.5rem" }}>
                            <button
                                onClick={() => handleSelectFolder(folder)}
                                style={{
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    borderRadius: "6px",
                                    backgroundColor: "#e0e0e0",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                📂 {folder.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Folder Actions (Rename/Delete) */}
            {selectedFolderId && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        marginTop: "1rem",
                    }}
                >
                    <button
                        onClick={() => {
                            onSelect(null);
                            setShowRenameInput(false);
                        }}
                        style={{
                            padding: "0.5rem 1rem",
                            fontSize: "1rem",
                            borderRadius: "6px",
                            backgroundColor: "#2196F3",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        ↶ Back
                    </button>

                    {!showRenameInput ? (
                        <button
                            onClick={() => setShowRenameInput(true)}
                            style={{
                                padding: "0.5rem 1rem",
                                fontSize: "1rem",
                                borderRadius: "6px",
                                backgroundColor: "#ff9800",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            ✏️ Rename Folder
                        </button>
                    ) : (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input
                                type="text"
                                value={renameInput}
                                onChange={(e) => setRenameInput(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "0.5rem",
                                    fontSize: "1rem",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                }}
                            />
                            <button
                                onClick={() => {
                                    handleRename();
                                    setShowRenameInput(false);
                                }}
                                style={{
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                ✔ Confirm
                            </button>
                            <button
                                onClick={() => setShowRenameInput(false)}
                                style={{
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "none",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            deleteFolder(selectedFolderId);
                        }}
                        style={{
                            padding: "0.5rem 1rem",
                            fontSize: "1rem",
                            borderRadius: "6px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default FolderList;
