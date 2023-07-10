import { useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";

export default function Upload() {
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [downloadLink, setDownloadLink] = useState("");
    const fileInputRef = useRef<any>(null);
    const [onDragOver, setOnDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [copiedLink, setCopiedLink] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileChange = (event: any) => {
        const selectedFile = event.target.files[0];
        setSelectedFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            console.error("No file selected");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        axios.post(`${import.meta.env.VITE_API_URL}/uploadFile`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent: any) => {
                const progress = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
                setUploadProgress(progress);
            },
        }).then((response: AxiosResponse) => {
            const { public_id } = response.data;
            const rootUrl = window.location.origin; // Cambiar por la URL real de tu aplicación
            const downloadUrl = `${rootUrl}/download/${public_id}`;
            setDownloadLink(downloadUrl);
        }).catch(() => {
            setErrorMessage("An error ocurred uploading your file");
        }).finally(() => {
            setUploading(false);
            setUploadProgress(0);
        });

    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(downloadLink);
        setCopiedLink(true);
        setTimeout(() => {
            setCopiedLink(false);
        }, 5000);
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDragOver = (event: any) => {
        event.preventDefault();
        setOnDragOver(true);
    };

    const handleDragLeave = (event: any) => {
        event.preventDefault();
        setOnDragOver(false);
    };

    const handleDrop = (event: any) => {

        event.preventDefault();
        setOnDragOver(false);

        if (uploading) return false;

        handleReset();
        const selectedFile = event.dataTransfer.files[0];
        setSelectedFile(selectedFile);


    };

    const formatFileSize = (size: number): string => {
        if (size < 1024) {
            return size + " B";
        } else if (size < 1024 * 1024) {
            return (size / 1024).toFixed(2) + " KB";
        } else {
            return (size / (1024 * 1024)).toFixed(2) + " MB";
        }
    };

    const handleReset = () => {

        setUploading(false);
        setSelectedFile(null)
        setDownloadLink("");
        setUploadProgress(0);
        setCopiedLink(false);
        setErrorMessage("");

    }

    return (
        <>
            <div
                className="drag-and-drop-area center"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ backgroundColor: onDragOver ? "#333" : "#222222" }}
            >
                {!selectedFile ? (
                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <span style={{ order: 1 }}>
                            <strong>Drag and drop here</strong>
                        </span>
                        <span style={{ order: 2 }}>or</span>
                        <button style={{ order: 3 }} onClick={handleButtonClick}>
                            Select file
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </div>
                ) : selectedFile && !uploading && !downloadLink && !errorMessage ? (
                    <div className="center" style={{ gap: "15px", width: '100%', textAlign: 'center' }}>
                        <span>
                            <strong>File selected:</strong> {selectedFile.name} (
                            {formatFileSize(selectedFile.size)})
                        </span>
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                ) : uploading ? (
                    <div className="center" style={{ width: '100%', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '15px' }}>Uploading file...</h3>
                        <div className="upload-progress">
                            <div
                                className="upload-progress-bar"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                ) : errorMessage ? (
                    <div className="center" style={{ textAlign: 'center' }}>
                        <h2 style={{ margin: 0 }}>Error uploading file</h2>
                        <p style={{ marginTop: '10px', marginBottom: '25px' }}>{errorMessage}</p>
                        <button className="warning" onClick={handleReset}>
                            Try again
                        </button>
                    </div>
                ) : downloadLink ? (
                    <div className="center" style={{ textAlign: 'center' }}>
                        <h2 style={{ margin: 0 }}>File uploaded successfully</h2>
                        <p style={{ marginTop: '10px', marginBottom: '25px' }}>Copy the download link below and share it!</p>
                        <button onClick={handleCopyLink} disabled={copiedLink}>
                            {copiedLink ? "Copied!" : "Copy link"}
                        </button>
                        <span style={{ cursor: 'pointer', textDecoration: 'underline', marginTop: '10px' }} onClick={handleReset}>Upload other file</span>
                    </div>
                ) : null}
            </div>
        </>
    );
}
