import { useState, useEffect } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";

function FileManager({ user }) {
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [unsortedFiles, setUnsortedFiles] = useState([]);
    const [moveSelections, setMoveSelections] = useState({});
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchFolders();
        fetchUnsortedFiles();
    }, []);

    const fetchFolders = async () => {
        try {
            const { data } = await axios.get("/api/folders");
            setFolders(data);
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    };

    const fetchFiles = async (folderId) => {
        try {
            const { data } = await axios.get(`/api/folders/${folderId}/files`);
            setFiles(data);
            setSelectedFolder(folderId);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const fetchUnsortedFiles = async () => {
        try {
            const { data } = await axios.get("/api/files");
            setUnsortedFiles(data.filter((file) => file.folderId === null));
        } catch (error) {
            console.error("Error fetching unsorted files:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this file?"))
            return;
        try {
            await axios.delete(`/api/files/${id}`);
            setFiles((prev) => prev.filter((file) => file.id !== id));
            setUnsortedFiles((prev) => prev.filter((file) => file.id !== id));
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    const moveFile = async (fileId) => {
        const newFolderId = moveSelections[fileId];
        if (!newFolderId && newFolderId !== "") return;
        try {
            await axios.put(`/api/files/${fileId}/move`, { newFolderId });
            setFiles((prev) => prev.filter((file) => file.id !== fileId));
            setUnsortedFiles((prev) =>
                prev.filter((file) => file.id !== fileId)
            );
            setMoveSelections((prev) => ({ ...prev, [fileId]: "" }));
        } catch (error) {
            console.error("Error moving file:", error);
        }
    };

    const FileItem = ({ file }) => (
        <li>
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
            <a href={`/api/files/download/${file.id}`} download>
                <button>Download 📥</button>
            </a>
            <button onClick={() => handleDelete(file.id)}>🗑 Delete</button>
            <select
                value={moveSelections[file.id] || ""}
                onChange={(e) =>
                    setMoveSelections((prev) => ({
                        ...prev,
                        [file.id]: e.target.value,
                    }))
                }
            >
                <option value="" disabled>
                    Move to...
                </option>
                <option value="">📂 Unsorted</option>
                {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                        {folder.name}
                    </option>
                ))}
            </select>
            <button onClick={() => moveFile(file.id)}>Move</button>
        </li>
    );

    const FileList = ({ title, files }) => (
        <div>
            <h2>{title}</h2>
            <ul>
                {files.length > 0 ? (
                    files.map((file) => <FileItem key={file.id} file={file} />)
                ) : (
                    <p>No files found.</p>
                )}
            </ul>
        </div>
    );

    return (
        <div>
            <FileUpload
                refreshFiles={() => fetchFiles(selectedFolder)}
                currentFolderId={selectedFolder}
            />
            {selectedFolder ? (
                <>
                    <button
                        onClick={() => {
                            setSelectedFolder(null);
                            setFiles([]);
                        }}
                    >
                        🔙 Back to Folders
                    </button>
                    <FileList title="Folder Contents" files={files} />
                </>
            ) : (
                <>
                    <h2>Folders</h2>
                    <ul>
                        {folders.map((folder) => (
                            <li key={folder.id}>
                                <button onClick={() => fetchFiles(folder.id)}>
                                    {folder.name} 📂
                                </button>
                            </li>
                        ))}
                    </ul>
                    <FileList title="Unsorted Files" files={unsortedFiles} />
                </>
            )}
        </div>
    );
}

export default FileManager;
