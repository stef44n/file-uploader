import { useState, useEffect, useRef } from "react";
import axios from "axios";

function FileManager({ user }) {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const { data } = await axios.get("/api/files");
            setFiles(data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const uploadFile = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await axios.post("/api/files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            // Fetch updated list from server
            fetchFiles();

            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset input field
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this file?"
        );
        if (!isConfirmed) return; // If user cancels, stop execution

        try {
            await axios.delete(`/api/files/${id}`);
            setFiles(files.filter((file) => file.id !== id)); // Update UI instantly
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    return (
        <div>
            <h2>File Manager</h2>

            <div>
                <h3>Upload File</h3>
                <input
                    type="file"
                    ref={fileInputRef} // Attach the ref here
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <button onClick={uploadFile}>Upload</button>
            </div>

            <div>
                <h3>Files</h3>
                <ul>
                    {files
                        .filter((file) => file.id && file.name) // Ignore empty files
                        .map((file) => (
                            <li key={file.id}>
                                {/* Show image preview if the file is an image */}
                                {file.mimetype.startsWith("image/") ? (
                                    <img
                                        src={`${apiUrl}/${file.path}`}
                                        alt={file.name}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <p>{file.name}</p>
                                )}

                                {/* Download Button */}
                                <a
                                    href={`/api/files/download/${file.id}`}
                                    download
                                >
                                    <button>Download</button>
                                </a>
                                <button onClick={() => handleDelete(file.id)}>
                                    🗑 Delete
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}

export default FileManager;
