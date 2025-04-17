const FileModal = ({ file, onClose }) => {
    if (!file) return null;

    const isImage = file.mimetype?.startsWith("image/");
    const readableSize = (file.size / 1024).toFixed(1); // KB

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "2rem",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    width: "90%",
                    maxWidth: "420px",
                    textAlign: "center",
                    animation: "fadeIn 0.3s ease-in-out",
                }}
            >
                <h3 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>
                    {file.originalName || file.name}
                </h3>

                {isImage && file.url ? (
                    <img
                        src={file.url}
                        alt={file.originalName}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "400px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            marginBottom: "1rem",
                        }}
                    />
                ) : (
                    <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>
                        No preview available
                    </p>
                )}

                <p style={{ margin: "0.5rem 0" }}>📦 Size: {readableSize} KB</p>
                <p style={{ margin: "0.5rem 0" }}>
                    📅 Uploaded: {new Date(file.createdAt).toLocaleString()}
                </p>

                {file.url && (
                    <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        style={{
                            display: "inline-block",
                            marginTop: "0.8rem",
                            marginBottom: "0.5rem",
                            color: "#007bff",
                            fontSize: "0.9rem",
                            textDecoration: "none",
                        }}
                    >
                        📥 Download
                    </a>
                )}

                <div>
                    <button
                        onClick={onClose}
                        style={{
                            marginTop: "1rem",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileModal;
