import React from "react";

export default function Topnav(){
    //get user's login and admin states
    const login = localStorage.getItem("isLoggedIn");
    const admin = localStorage.getItem("isAdmin");

    return(
        <nav className="topnav">
            {/*Display if the user is an admin*/}
            {admin === "true" ? <div className="admin" >Admin User</div> : null}
            <ul>
                <li>
                <ActiveLink href="/">Welcome</ActiveLink>
                <ActiveLink href="/Home">Home</ActiveLink>
                {/*Hide some elements if the user isnt logged in*/}
                {login ? <>
                <ActiveLink href="/MyLists">My Lists</ActiveLink>
                <ActiveLink href="/CreateList">Create List</ActiveLink>
                <ActiveLink href="/EditList">Edit List</ActiveLink>
                {/*Hide the admin tab if not an admin*/}
                {admin === "true" ? <ActiveLink href="/Admin">Admin</ActiveLink> : null}
                <ActiveLink href="/logout">Log Out</ActiveLink>
                </> : null}
                {/*Hide the login tab if the user is logged in*/}
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