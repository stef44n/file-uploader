import { useState } from "react";
import axios from "axios";

const FileList = ({ files, onMoveFile }) => {
    const [selectedFolder, setSelectedFolder] = useState("");

    const deleteFile = async (id) => {
        if (!window.confirm("Delete this file?")) return;
        await axios.delete(`/api/files/${id}`);
    };

    return (
        <ul>
            {files.map((file) => (
                <li key={file.id}>
                    {file.name}
                    <button onClick={() => deleteFile(file.id)}>🗑️</button>
                    <button onClick={() => alert(`Details for ${file.name}`)}>
                        ℹ️
                    </button>
                    <select onChange={(e) => setSelectedFolder(e.target.value)}>
                        <option value="">Move to...</option>
                        {/* Populate with folders */}
                    </select>
                    <button onClick={() => onMoveFile(file.id)}>Move</button>
                </li>
            ))}
        </ul>
    );
};

export default FileList;
