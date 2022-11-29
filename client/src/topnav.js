import './App.css';

export default function Topnav(){

    return(
        <nav className="topnav">
            <ul>
                <li>
                <ActiveLink href="/Home">Home</ActiveLink>
                <ActiveLink href="/Genres">Genres</ActiveLink>
                <ActiveLink href="/">Lists</ActiveLink>
                <ActiveLink href="/Artists">Artists</ActiveLink>
                <ActiveLink href="/">Tracks</ActiveLink>
                </li>
            </ul>
        </nav>
    );
}

function ActiveLink ({href, children, ...props }){
    const path = window.location.pathname
    return(
            <a className = {path === href ? "active" : ""} href = {href} {...props}>{children}</a>
    );
}