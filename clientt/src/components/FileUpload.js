import { useState, useEffect } from "react";
import axios from "axios";

const FileUpload = ({ refreshFiles, currentFolderId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(currentFolderId || "");

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const { data } = await axios.get("/api/folders");
                setFolders(data);
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
            refreshFiles(); // Refresh the file list
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />

            {/* Folder Selection Dropdown */}
            <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
            >
                <option value="">No Folder</option>
                {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                        {folder.name}
                    </option>
                ))}
            </select>

            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
