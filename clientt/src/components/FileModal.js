const FileModal = ({ file, onClose }) => {
    return file ? (
        <div className="modal">
            <h3>{file.name}</h3>
            <p>Size: {file.size} KB</p>
            <p>Uploaded: {new Date(file.createdAt).toLocaleString()}</p>
            <button onClick={onClose}>Close</button>
        </div>
    ) : null;
};

export default FileModal;
