import React from "react";


export default function Footer() {
    const admin = localStorage.getItem("isAdmin");

    return (
        <nav className="footer">
            <div className="footer">
                <ActiveLink href="/AUP">Acceptable Use Policy</ActiveLink>
                <ActiveLink href="/DMCA">DMCA and Takedown Policy</ActiveLink>
                <ActiveLink href="/Privacy">Privacy Policy</ActiveLink>
                {admin === "true" ? <ActiveLink href="/Instructions">DMCA Instructions for Admins</ActiveLink> : null}
            </div>
        </nav>
    )

    function ActiveLink({ href, id, children, ...props }) {
        const path = window.location.pathname
        return (
            <a className={path === href ? "active" : ""} href={href} {...props}>{children}</a>
        );
    }

}
