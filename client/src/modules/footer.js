import React from "react";

export default function footer() {

    return (
        <nav className="footer">
            <div class="footer">
                <ul>
                    <li>
                        <ActiveLink href="/SPP">Security and Privacy Policy</ActiveLink>
                        <ActiveLink href="/DMCA">DMCA Notice</ActiveLink>
                        <ActiveLink href="/AUP">Acceptable Use Policy</ActiveLink>
                        <ActiveLink href="/Takedown">Takedown Policy</ActiveLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

function ActiveLink({ href, children, ...props }) {
    const path = window.location.pathname
    return (
        <a className={path === href ? "active" : ""} href={href} {...props}>{children}</a>
    );
}