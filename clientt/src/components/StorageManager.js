import { useState, useEffect } from "react";
import axios from "axios";
import FolderList from "./FolderList";
import FileManager from "./FileManager";
import UnsortedFiles from "./UnsortedFiles";
import FileUpload from "./FileUpload";

const StorageManager = () => {
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [unsortedFiles, setUnsortedFiles] = useState([]);

    // Fetch folders and files
    const fetchFolders = async () => {
        try {
            const { data } = await axios.get("/api/folders");

            // Sort folders by creation date (oldest to newest)
            const sortedFolders = data.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );

            setFolders(sortedFolders);
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    };

    const fetchFiles = async (folderId) => {
        try {
            const { data } = await axios.get(`/api/folders/${folderId}/files`);
            setFiles(data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const fetchUnsortedFiles = async () => {
        try {
            const { data } = await axios.get("/api/files/unsorted");
            setUnsortedFiles(data);
        } catch (error) {
            console.error("Error fetching unsorted files:", error);
        }
    };

    useEffect(() => {
        fetchFolders();
        fetchUnsortedFiles();
    }, []);

    return (
        <div
            style={{
                padding: "1.5rem",
                backgroundColor: "#f9f9f9",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                marginTop: "2rem",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                🗃️ Storage Manager
            </h2>

            {/* Folder List Section */}
            <div
                style={{
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
            >
                <FolderList
                    folders={folders}
                    onSelect={setSelectedFolder}
                    refreshFolders={fetchFolders}
                    fetchFiles={fetchFiles}
                    setFiles={setFiles}
                    selectedFolderId={selectedFolder?.id}
                />
            </div>

            {/* Upload UI */}
            <div
                style={{
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
            >
                <FileUpload
                    refreshFiles={() => {
                        if (selectedFolder) {
                            fetchFiles(selectedFolder.id);
                        } else {
                            fetchUnsortedFiles();
                        }
                    }}
                    currentFolderId={selectedFolder?.id || ""}
                />
            </div>

            {/* File Manager / Unsorted Files Display */}
            {selectedFolder ? (
                <div
                    style={{
                        padding: "1rem",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    }}
                >
                    <FileManager
                        files={files}
                        folders={folders}
                        selectedFolder={selectedFolder}
                        refreshFiles={fetchFiles}
                        fetchUnsortedFiles={fetchUnsortedFiles}
                    />
                </div>
            ) : (
                <div
                    style={{
                        marginTop: "2rem",
                        padding: "1rem",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    }}
                >
                    <h3 style={{ marginBottom: "1rem" }}>🗂️ Unsorted Files</h3>
                    <UnsortedFiles
                        unsortedFiles={unsortedFiles}
                        folders={folders}
                        fetchUnsortedFiles={fetchUnsortedFiles}
                        refreshFolders={fetchFolders}
                    />
                </div>
            )}
        </div>
    );
};

export default StorageManager;
