import react, { useState } from "react";
import axios from "axios";

export default function Footer() {
    const getDoc = (e) => {
        e.preventDefault();
        axios.get('/api/docs/find/' + e.target.id)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.log(error)
            })

    }

    return (
        <nav className="footer">
            <div className="footer">
                <ActiveLink onClick={getDoc} id="AUP" href="/docs">AUP</ActiveLink>
                <ActiveLink onClick={getDoc} id="DMCA" href="/DMCA">DMCA and Takedown Policy</ActiveLink>
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



