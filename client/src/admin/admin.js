import React, { useState, useRef } from 'react';
import ErrorDisplay from '../modules/errorDisplay';

export default function Admin() {
    //get admins sate
    const admin = localStorage.getItem("isAdmin");
    //server state for error handling
    const [serverStatus, setServerStatus] = useState([])

    //refs
    const userEmailRef = useRef()

    //api call for making a specific user an admin using their email
    async function makeAdmin(e) {
        const email = userEmailRef.current.value

        setServerStatus("Loading...")
        fetch('/api/admins/changestatus', {
            method: 'PUT',
            headers: {
                'Accept': '/',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('x-auth-token')
            },
            body: JSON.stringify({
                email: email,
                isAdmin: true
            })
        }).then(response =>
            response.json())
            .then(data => {
                if (data.errors) {
                    setServerStatus(data.errors[0].msg)
                } else {
                    setServerStatus(`User has been made Admin!`)
                }
            }
            )
    }

    //api call for deactivating a specific user using their email
    async function deactivateUser(e) {
        const email = userEmailRef.current.value

        setServerStatus("Loading...")
        fetch('/api/admins/deactivate', {
            method: 'PUT',
            headers: {
                'Accept': '/',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('x-auth-token')
            },
            body: JSON.stringify({
                email: email,
                deactivated: true
            })
        }).then(response =>
            response.json())
            .then(data => {
                if (data.errors) {
                    setServerStatus(data.errors[0].msg)
                } else {
                    setServerStatus(`User has been deactivated!`)
                }
            }
            )
    }

    return (
        <>
            {admin ? <>
                <ErrorDisplay errors={serverStatus} />
                <h2>Admin Tools</h2>
                <br />
                <input ref={userEmailRef} type="text" placeholder="Enter User Email..." />
                <br />
                <input type="button" onClick={makeAdmin} defaultValue="Give Admin Rights" />
                <br />
                <input type="button" onClick={deactivateUser} defaultValue="Deactivate User" />
                <br />
            </> : null}
        </>
    )
}