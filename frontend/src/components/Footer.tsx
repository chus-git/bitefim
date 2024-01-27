export default function Footer() {

    return (
        <footer className="center">
            <span>limited to <strong className="primary">300mb/24h</strong></span>
            <span>limited to <strong className="primary">3 files/10min</strong></span>
            <span>maximum <strong className="primary">100mb</strong> per file</span>
            <span>files are deleted <strong className="primary">5 min</strong> after upload</span>
            <br />
            <span style={{color: "#808080", fontStyle: "italic"}}>This is an open source project, check source <a href="https://github.com/chus-git/bitefim" target="_blank" title="Visit the GitHub repository">here</a></span>
        </footer>
    );

}