import { useState, useEffect, useRef } from "react";
import axios from "axios";

function FileManager({ user }) {
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [folderName, setFolderName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchFolders();
        fetchFiles();
    }, []);

    const fetchFolders = async () => {
        try {
            const { data } = await axios.get("/api/folders");
            setFolders(data);
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    };

    const fetchFiles = async () => {
        try {
            const { data } = await axios.get("/api/files");
            setFiles(data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const createFolder = async () => {
        try {
            const { data } = await axios.post("/api/folders", {
                name: folderName,
            });
            setFolders([...folders, data]);
            setFolderName("");
        } catch (error) {
            console.error("Error creating folder:", error);
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

            // ✅ Fetch updated list from server
            fetchFiles();

            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset input field
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <div>
            <h2>File Manager</h2>

            <div>
                <h3>Upload File</h3>
                <input
                    type="file"
                    ref={fileInputRef} // ✅ Attach the ref here
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <button onClick={uploadFile}>Upload</button>
            </div>

            <div>
                <h3>Create Folder</h3>
                <input
                    type="text"
                    placeholder="Folder name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                />
                <button onClick={createFolder}>Create</button>
            </div>

            <div>
                <h3>Folders</h3>
                <ul>
                    {folders.map((folder) => (
                        <li key={folder.id}>{folder.name}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Files</h3>
                <ul>
                    {files
                        .filter((file) => file.id && file.name) // ✅ Ignore empty files
                        .map((file) => (
                            <li key={file.id}>{file.name}</li>
                        ))}
                </ul>
            </div>
        </div>
    );
}

export default FileManager;
