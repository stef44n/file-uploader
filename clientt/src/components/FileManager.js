import React, { useState } from "react";
import axios from "axios";
import FileModal from "./FileModal";

const FileManager = ({
    selectedFolder,
    files = [],
    folders = [],
    refreshFiles,
    fetchUnsortedFiles,
}) => {
    const [moveTargets, setMoveTargets] = useState({}); // { fileId: newFolderId }
    const [selectedFileInfo, setSelectedFileInfo] = useState(null);

    const handleSelectChange = (fileId, folderId) => {
        setMoveTargets((prev) => ({ ...prev, [fileId]: folderId }));
    };

    const handleConfirmMove = async (fileId, targetFolderId) => {
        try {
            const newFolderId = moveTargets[fileId] || null;

            await axios.put(`/api/files/${fileId}/move`, {
                newFolderId,
            });

            setMoveTargets((prev) => {
                const updated = { ...prev };
                delete updated[fileId];
                return updated;
            });

            if (!targetFolderId) {
                // If moving to unsorted, make sure unsorted list is updated
                fetchUnsortedFiles();
            }

            refreshFiles?.(selectedFolder?.id);
        } catch (error) {
            console.error("Error moving file:", error);
        }
    };

    const deleteFile = async (fileId) => {
        try {
            await axios.delete(`/api/files/${fileId}`);
            refreshFiles?.(selectedFolder?.id);
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("There was an issue deleting the file.");
        }
    };

    return (
        <div>
            {selectedFolder && (
                <h3
                    style={{
                        marginTop: "2rem",
                        fontSize: "1.5rem",
                        fontWeight: "600",
                    }}
                >
                    Files in: <strong>{selectedFolder.name}</strong>
                </h3>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: "1.5rem",
                    marginTop: "1.5rem",
                }}
            >
                {files.length > 0 ? (
                    files.map((file) => {
                        const isImage = /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(
                            file.name
                        );
                        const selectedMove =
                            moveTargets[file.id] ?? file.folderId ?? "";
                        const hasChange =
                            selectedMove !== (file.folderId ?? "");

                        return (
                            <div
                                key={file.id}
                                style={{
                                    backgroundColor: "#fff",
                                    padding: "1rem",
                                    borderRadius: "10px",
                                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}
                            >
                                {isImage ? (
                                    <img
                                        onClick={() =>
                                            setSelectedFileInfo(file)
                                        }
                                        src={`http://localhost:5000/${file.path}`}
                                        alt={file.name}
                                        style={{
                                            cursor: "pointer",
                                            width: "100%",
                                            height: "100px",
                                            objectFit: "cover",
                                            borderRadius: "6px",
                                            marginBottom: "0.5rem",
                                        }}
                                    />
                                ) : (
                                    <div
                                        onClick={() =>
                                            setSelectedFileInfo(file)
                                        }
                                        style={{
                                            cursor: "pointer",
                                            height: "100px",
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#f0f0f0",
                                            borderRadius: "6px",
                                            marginBottom: "0.5rem",
                                            padding: "0.5rem",
                                            fontSize: "0.85rem",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {file.name}
                                    </div>
                                )}

                                <div
                                    style={{
                                        fontSize: "0.85rem",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <a
                                        href={`http://localhost:5000/${file.path}`}
                                        download
                                        style={{
                                            textDecoration: "none",
                                            color: "#007bff",
                                            marginBottom: "0.5rem",
                                            display: "inline-block",
                                        }}
                                    >
                                        📥 Download
                                    </a>
                                </div>

                                <button
                                    onClick={() => {
                                        const confirmDelete = window.confirm(
                                            "Are you sure you want to delete this file?"
                                        );
                                        if (confirmDelete) {
                                            deleteFile(file.id);
                                        }
                                    }}
                                    style={{
                                        backgroundColor: "#dc3545",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "0.4rem 0.6rem",
                                        fontSize: "0.75rem",
                                        cursor: "pointer",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    🗑️ Delete
                                </button>

                                <select
                                    value={selectedMove}
                                    onChange={(e) =>
                                        handleSelectChange(
                                            file.id,
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        fontSize: "0.8rem",
                                        padding: "0.35rem",
                                        width: "100%",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        marginBottom: "0.4rem",
                                    }}
                                >
                                    <option value="">Unsorted</option>
                                    {folders.map((folder) => (
                                        <option
                                            key={folder.id}
                                            value={folder.id}
                                        >
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>

                                {hasChange && (
                                    <button
                                        onClick={() =>
                                            handleConfirmMove(file.id)
                                        }
                                        style={{
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            padding: "0.35rem 0.6rem",
                                            fontSize: "0.75rem",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Move
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p
                        style={{
                            gridColumn: "1/-1",
                            fontSize: "1rem",
                            textAlign: "center",
                        }}
                    >
                        No files in this folder.
                    </p>
                )}
            </div>

            <FileModal
                file={selectedFileInfo}
                onClose={() => setSelectedFileInfo(null)}
            />
        </div>
    );
};

export default FileManager;
