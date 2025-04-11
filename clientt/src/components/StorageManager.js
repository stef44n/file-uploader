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
        <div>
            <h2>Storage Manager</h2>

            <FolderList
                folders={folders}
                onSelect={setSelectedFolder}
                refreshFolders={fetchFolders}
                fetchFiles={fetchFiles}
                setFiles={setFiles}
                selectedFolderId={selectedFolder?.id}
            />
            {selectedFolder && (
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
            )}
            {!selectedFolder && (
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
            )}
            {/* Show files and folder CRUD functions when a folder is selected */}
            {selectedFolder && (
                <div>
                    <FileManager
                        files={files}
                        folders={folders} // ← important
                        selectedFolder={selectedFolder}
                        refreshFiles={fetchFiles}
                        // unsortedFiles={unsortedFiles}
                        fetchUnsortedFiles={fetchUnsortedFiles}
                    />
                    {/* <h3>Folder: {selectedFolder.name}</h3>
                    <h4>Files</h4> */}
                </div>
            )}
            {!selectedFolder && (
                <>
                    <h3>Unsorted Files</h3>
                    <UnsortedFiles
                        unsortedFiles={unsortedFiles}
                        folders={folders}
                        fetchUnsortedFiles={fetchUnsortedFiles}
                        refreshFolders={fetchFolders}
                    />
                </>
            )}
        </div>
    );
};

export default StorageManager;
