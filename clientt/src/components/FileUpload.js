import { useState, useEffect, useRef } from "react";
import axios from "axios";

const FileUpload = ({ refreshFiles, currentFolderId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(currentFolderId || "");
    const fileInputRef = useRef(null);

    useEffect(() => {
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

        fetchFolders();
    }, []);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("folderId", selectedFolder);

        try {
            await axios.post("/api/files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset input field
            }
            refreshFiles(); // Refresh the file list
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "1rem",
                marginTop: "2rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
            }}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{
                    fontSize: "1rem",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fff",
                }}
            />

            {selectedFile && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        backgroundColor: "#fff",
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                    }}
                >
                    {selectedFile.type.startsWith("image/") ? (
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="preview"
                            style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "6px",
                            }}
                        />
                    ) : (
                        <span role="img" aria-label="file">
                            📄
                        </span>
                    )}
                    <div>
                        <p style={{ margin: 0 }}>{selectedFile.name}</p>
                        <small>
                            {(selectedFile.size / 1024).toFixed(1)} KB
                        </small>
                    </div>
                </div>
            )}

            {/* Folder Selection Dropdown */}
            <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                style={{
                    fontSize: "1rem",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fff",
                }}
            >
                <option value="">📂 No Folder</option>
                {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                        📁 {folder.name}
                    </option>
                ))}
            </select>

            <button
                onClick={handleUpload}
                style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "0.75rem 1.25rem",
                    fontSize: "1rem",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                }}
            >
                ⬆ Upload
            </button>
        </div>
    );
};

export default FileUpload;
