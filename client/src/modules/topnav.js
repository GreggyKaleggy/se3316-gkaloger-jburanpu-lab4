import React from "react";

export default function Topnav(){
    const login = localStorage.getItem("isLoggedIn");

    return(
        <nav className="topnav">
            <ul>
                <li>
                <ActiveLink href="/">Welcome</ActiveLink>
                <ActiveLink href="/Home">Home</ActiveLink>
                {login ? <>
                <ActiveLink href="/MyLists">My Lists</ActiveLink>
                <ActiveLink href="/CreateList">Create List</ActiveLink>
                <ActiveLink href="/EditList">Edit List</ActiveLink>
                <ActiveLink href="/Tracks">Admin</ActiveLink>
                <ActiveLink href="/logout">Log Out</ActiveLink>
                </> : null}
                {!login ? <>
                <ActiveLink href="/login">Login</ActiveLink>
                </> : null}
                
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