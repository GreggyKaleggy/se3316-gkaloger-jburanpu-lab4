import React from "react";

export default function Topnav(){

    return(
        <nav className="topnav">
            <ul>
                <li>
                <ActiveLink href="/">Welcome</ActiveLink>
                <ActiveLink href="/Home">Home</ActiveLink>
                <ActiveLink href="/MyLists">My Lists</ActiveLink>
                <ActiveLink href="/CreateList">Create List</ActiveLink>
                <ActiveLink href="/EditList">Edit List</ActiveLink>
                <ActiveLink href="/Tracks">Admin</ActiveLink>
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