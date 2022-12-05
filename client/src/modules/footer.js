import React, { useState } from "react";


export default function Footer() {

    return (
        <nav className="footer">
            <div className="footer">
                <ActiveLink href="/Docs">AUP</ActiveLink>
                <ActiveLink href="/Docs">DMCA and Takedown Policy</ActiveLink>
                <ActiveLink href="/Docs">Privacy Policy</ActiveLink>
                <ActiveLink href="/Docs">DMCA Instructions for Admins</ActiveLink>
            </div>
        </nav>
    )

    function ActiveLink({ href, children, ...props }) {
        const path = window.location.pathname
        return (
            <a className={path === href ? "active" : ""} href={href} {...props}>{children}</a>
        );
    }
}



