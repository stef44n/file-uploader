import React, { useState } from "react";
import axios from "axios";

const UnsortedFiles = ({
    unsortedFiles,
    folders,
    fetchUnsortedFiles,
    refreshFolders,
}) => {
    const [moveSelections, setMoveSelections] = useState({});
    const [confirmDeletes, setConfirmDeletes] = useState({});

    const handleMoveFile = async (fileId) => {
        const newFolderId = moveSelections[fileId];
        if (!newFolderId) return;

        try {
            await axios.put(`/api/files/${fileId}/move`, {
                newFolderId,
            });
            fetchUnsortedFiles();
            refreshFolders();
        } catch (error) {
            console.error("Error moving file:", error);
        }
    };

    const handleDelete = async (fileId) => {
        try {
            await axios.delete(`/api/files/${fileId}`);
            fetchUnsortedFiles();
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "1.5rem",
                marginTop: "2rem",
            }}
        >
            {unsortedFiles.length > 0 ? (
                unsortedFiles.map((file) => {
                    const isImage = /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(
                        file.name
                    );
                    const fileId = file.id;

                    return (
                        <div
                            key={fileId}
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
                                    src={`http://localhost:5000/${file.path}`}
                                    alt={file.name}
                                    style={{
                                        width: "100%",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                        marginBottom: "0.5rem",
                                        cursor: "pointer",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        height: "100px",
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#f0f0f0",
                                        borderRadius: "6px",
                                        boxShadow:
                                            "inset 0 1px 3px rgba(0, 0, 0, 0.05)",
                                        padding: "0.5rem",
                                        marginBottom: "0.5rem",
                                        fontSize: "0.85rem",
                                        overflow: "hidden",
                                    }}
                                >
                                    {file.name}
                                </div>
                            )}

                            <a
                                href={`http://localhost:5000/${file.path}`}
                                download
                                style={{
                                    fontSize: "0.85rem",
                                    marginBottom: "0.6rem",
                                    textDecoration: "none",
                                    color: "#007bff",
                                }}
                            >
                                📥 Download
                            </a>

                            {/* Move to folder */}
                            <div
                                style={{
                                    width: "100%",
                                    marginBottom: "0.6rem",
                                }}
                            >
                                <select
                                    value={moveSelections[fileId] || ""}
                                    onChange={(e) =>
                                        setMoveSelections((prev) => ({
                                            ...prev,
                                            [fileId]: e.target.value,
                                        }))
                                    }
                                    style={{
                                        fontSize: "0.8rem",
                                        width: "100%",
                                        padding: "0.4rem",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                    }}
                                >
                                    <option value="">Move to...</option>
                                    {folders.map((folder) => (
                                        <option
                                            key={folder.id}
                                            value={folder.id}
                                        >
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleMoveFile(fileId)}
                                    disabled={!moveSelections[fileId]}
                                    style={{
                                        marginTop: "0.4rem",
                                        width: "100%",
                                        backgroundColor: moveSelections[fileId]
                                            ? "#007bff"
                                            : "#ccc",
                                        color: "white",
                                        border: "none",
                                        padding: "0.4rem",
                                        borderRadius: "4px",
                                        fontSize: "0.75rem",
                                        cursor: moveSelections[fileId]
                                            ? "pointer"
                                            : "not-allowed",
                                    }}
                                >
                                    ✔ Move
                                </button>
                            </div>

                            {/* Delete with confirmation */}
                            <div style={{ width: "100%" }}>
                                {!confirmDeletes[fileId] ? (
                                    <button
                                        onClick={() =>
                                            setConfirmDeletes((prev) => ({
                                                ...prev,
                                                [fileId]: true,
                                            }))
                                        }
                                        style={{
                                            color: "white",
                                            backgroundColor: "#dc3545",
                                            border: "none",
                                            padding: "0.4rem",
                                            fontSize: "0.75rem",
                                            width: "100%",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        🗑️ Delete
                                    </button>
                                ) : (
                                    <div style={{ fontSize: "0.8rem" }}>
                                        <p>Are you sure?</p>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "0.5rem",
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    handleDelete(fileId)
                                                }
                                                style={{
                                                    backgroundColor: "#dc3545",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "0.3rem 0.5rem",
                                                    fontSize: "0.75rem",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setConfirmDeletes(
                                                        (prev) => ({
                                                            ...prev,
                                                            [fileId]: false,
                                                        })
                                                    )
                                                }
                                                style={{
                                                    backgroundColor: "#6c757d",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "0.3rem 0.5rem",
                                                    fontSize: "0.75rem",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p
                    style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        fontSize: "1rem",
                    }}
                >
                    No unsorted files available.
                </p>
            )}
        </div>
    );
};

export default UnsortedFiles;
