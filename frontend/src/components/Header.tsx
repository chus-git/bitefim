import { Link } from "react-router-dom";

export default function Header() {

    return (
        <header className="center">
            <Link to="/" className="logo" style={{textDecoration: 'none'}}>bitefim.</Link>
            <span className="slogan">upload and share files easily</span>
        </header>
    );

}