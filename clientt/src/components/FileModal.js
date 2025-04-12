const FileModal = ({ file, onClose }) => {
    return file ? (
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
                    {file.name}
                </h3>

                {/\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(file.name) ? (
                    <img
                        src={`http://localhost:5000/${file.path}`}
                        alt={file.name}
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

                <p style={{ margin: "0.5rem 0" }}>📦 Size: {file.size} KB</p>
                <p style={{ margin: "0.5rem 0" }}>
                    📅 Uploaded: {new Date(file.createdAt).toLocaleString()}
                </p>

                <a
                    href={`http://localhost:5000/${file.path}`}
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
    ) : null;
};

export default FileModal;
