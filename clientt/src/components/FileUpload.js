import { useState, useEffect, useRef } from "react";
import { getFolders, uploadFile } from "../api";
import { toast } from "react-toastify";

const FileUpload = ({ refreshFiles, currentFolderId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(currentFolderId || "");
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const { data } = await getFolders();
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
            await uploadFile(formData);
            toast.success("File uploaded!");
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            refreshFiles();
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Upload failed. Please try again.");
        }
    };

    const baseInputStyle = {
        fontSize: "1rem",
        padding: "0.6rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
    };

    const buttonStyle = {
        padding: "0.6rem 1.2rem",
        fontSize: "1rem",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontWeight: "500",
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "1.5rem",
                marginTop: "2rem",
                border: "1px solid #ccc",
                borderRadius: "12px",
                backgroundColor: "#fefefe",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                maxWidth: "480px",
            }}
        >
            <h3 style={{ marginBottom: "0.5rem" }}>📤 Upload a File</h3>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={baseInputStyle}
            />

            {selectedFile && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        backgroundColor: "#fff",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
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
                        <span
                            role="img"
                            aria-label="file"
                            style={{ fontSize: "1.5rem" }}
                        >
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

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                }}
            >
                <label
                    htmlFor="folderSelect"
                    style={{ fontWeight: "bold", fontSize: "0.95rem" }}
                >
                    Save to Folder
                </label>
                <select
                    id="folderSelect"
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    style={baseInputStyle}
                >
                    <option value="">📂 No Folder</option>
                    {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                            📁 {folder.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleUpload}
                style={{
                    ...buttonStyle,
                    backgroundColor: "#4CAF50",
                    color: "white",
                }}
            >
                ⬆ Upload
            </button>
        </div>
    );
};

export default FileUpload;
