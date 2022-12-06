import React from "react";

export default function Topnav(){
    const login = localStorage.getItem("isLoggedIn");
    const admin = localStorage.getItem("isAdmin");

    return(
        <nav className="topnav">
            {admin ? <div className="admin" >Admin User</div> : null}
            <ul>
                <li>
                <ActiveLink href="/">Welcome</ActiveLink>
                <ActiveLink href="/Home">Home</ActiveLink>
                {login ? <>
                <ActiveLink href="/MyLists">My Lists</ActiveLink>
                <ActiveLink href="/CreateList">Create List</ActiveLink>
                <ActiveLink href="/EditList">Edit List</ActiveLink>
                {admin ? <ActiveLink href="/Admin">Admin</ActiveLink> : null}
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