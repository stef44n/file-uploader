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
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "1rem",
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
                        <div key={fileId} style={{ textAlign: "center" }}>
                            {isImage ? (
                                <img
                                    src={`http://localhost:5000/${file.path}`}
                                    alt={file.name}
                                    style={{
                                        width: "100%",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                        cursor: "pointer",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        height: "100px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#f0f0f0",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                        padding: "0.5rem",
                                    }}
                                >
                                    {file.name}
                                </div>
                            )}

                            <a
                                href={`http://localhost:5000/${file.path}`}
                                download
                                style={{
                                    marginTop: "0.5rem",
                                    display: "inline-block",
                                    fontSize: "0.9rem",
                                }}
                            >
                                📥 Download
                            </a>

                            {/* Move to folder */}
                            <div style={{ marginTop: "0.5rem" }}>
                                <select
                                    value={moveSelections[fileId] || ""}
                                    onChange={(e) =>
                                        setMoveSelections((prev) => ({
                                            ...prev,
                                            [fileId]: e.target.value,
                                        }))
                                    }
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
                                    style={{ marginLeft: "0.5rem" }}
                                >
                                    ✔ Move
                                </button>
                            </div>

                            {/* Delete with confirmation */}
                            <div style={{ marginTop: "0.5rem" }}>
                                {!confirmDeletes[fileId] ? (
                                    <button
                                        onClick={() =>
                                            setConfirmDeletes((prev) => ({
                                                ...prev,
                                                [fileId]: true,
                                            }))
                                        }
                                        style={{
                                            color: "red",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        🗑️ Delete
                                    </button>
                                ) : (
                                    <div style={{ marginTop: "0.3rem" }}>
                                        <p style={{ fontSize: "0.8rem" }}>
                                            Are you sure?
                                        </p>
                                        <button
                                            onClick={() => handleDelete(fileId)}
                                            style={{
                                                marginRight: "0.3rem",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() =>
                                                setConfirmDeletes((prev) => ({
                                                    ...prev,
                                                    [fileId]: false,
                                                }))
                                            }
                                            style={{ fontSize: "0.8rem" }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p style={{ gridColumn: "1 / -1" }}>
                    No unsorted files available.
                </p>
            )}
        </div>
    );
};

export default UnsortedFiles;
