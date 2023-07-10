export default function Loader() {
    const styles = `

        .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .loader {
            width: 60px;
            height: 60px;
            border: 6px solid var(--primary);
            border-bottom-color: transparent;
            border-radius: 9999px;
            display: inline-block;
            animation: spin 1s infinite linear;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `;

    return (
        <div className="loader-container">
            <span className="loader">
                <style>{styles}</style>
            </span>
        </div>
    );
}
