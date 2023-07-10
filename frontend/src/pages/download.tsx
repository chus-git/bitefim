import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import Loadable from "../components/Loadable";

interface FileProps {
    name: string;
    size: number;
    remaining_seconds: number;
    status: string;
}

export default function Download() {
    const { fileID } = useParams();
    const [fileInfo, setFileInfo] = useState<FileProps | null>(null);
    const [requestingFileInfo, setRequestingFileInfo] = useState(true);
    const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        // Fetch file info
        axios
            .get(`http://localhost:9000/api/requestFileInfo/${fileID}`)
            .then((response) => {
                setFileInfo(response.data);
                setRemainingSeconds(response.data.remaining_seconds);
                console.log(response.data)
            })
            .catch((error) => {
                console.error("Error fetching file info:", error);
            }).finally(() => {
                setRequestingFileInfo(false);
            });
    }, []);

    useEffect(() => {
        let interval: any = null;

        if (remainingSeconds && remainingSeconds > 0) {
            interval = setInterval(() => {
                setRemainingSeconds((prevRemainingSeconds: number) =>
                    prevRemainingSeconds ? prevRemainingSeconds - 1 : 0
                );
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [remainingSeconds]);

    const handleDownload = () => {

        setDownloading(true);

        // Request file download
        axios
            .get(`http://localhost:9000/api/requestFile/${fileID}`, {
                responseType: "blob",
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                if (!fileInfo) return;
                link.setAttribute("download", fileInfo?.name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.error("Error downloading file:", error);
            }).finally(() => {
                setDownloading(false);
            });
    };

    const formatFileSize = (size: number): string => {

        if (size < 1024) {
            return size + "b";
        } else if (size < 1024 * 1024) {
            return (size / 1024).toFixed(2) + "kb";
        } else {
            return (size / (1024 * 1024)).toFixed(2) + "mb";
        }
    };

    return (

        <Loadable loading={!fileInfo} failed={!requestingFileInfo && !fileInfo}>
            <div className="download-area center">
                {remainingSeconds ? (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left', width: '100%', maxWidth: '200px' }}>
                            <span>
                                <strong>
                                    Expires in:{" "}
                                </strong>{Math.floor(remainingSeconds / 60)} min {remainingSeconds % 60} sec
                            </span>
                        </div>
                        <button onClick={handleDownload} style={{ marginTop: '20px' }} disabled={downloading}>
                            {!downloading ? (
                                <><FaDownload /> {fileInfo?.name} ({fileInfo ? formatFileSize(fileInfo.size) : ""})</>
                            ) : (
                                "Downloading..."
                            )}

                        </button>
                    </>
                ) : (
                    <div style={{textAlign: 'center'}}>
                        <h2>This file has expired</h2>
                        <p>The file <strong>{fileInfo?.name}</strong> has expired. <Link to="/">Upload</Link> it again!</p>
                    </div>
                )}
            </div>
        </Loadable >


    );
}
