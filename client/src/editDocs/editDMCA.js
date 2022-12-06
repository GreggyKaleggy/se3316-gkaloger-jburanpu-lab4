import React, { useState, useRef } from "react";

export default function EditDocs() {
    const login = localStorage.getItem("isLoggedIn");
    const [serverStatus, setServerStatus] = useState("")

    const NameRef = useRef()
    const contentRef = useRef()

    async function editDoc() {
        const newName = NameRef.current.value
        const newContent = contentRef.current.value

        setServerStatus("Loading...")
        fetch('/api/docs/editdoc/638e6e10e86ca3056346be07', {
            method: 'PUT',
            headers: {
                'Accept': '/',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('x-auth-token')
            },
            body: JSON.stringify({
                title: newName,
                content: newContent
            })
        }).then(response =>
            response.json())
            .then(data => {
                if (data.errors) {
                    setServerStatus(`Error: ${data.errors[0].msg}`)
                } else {
                    setServerStatus("Document Updated")
                }
            }
            )

    }

    return (
        <>
            {!login ? <>
                <h2>You must be logged in to edit the document</h2>
            </>
                : null}
            {login ? <>
                <h2>Edit Document</h2>
                <hr />
                <input ref={NameRef} type="text" placeholder="New Name" />
                <br />
                <input ref={contentRef} type="text" placeholder="New Content" />
                <br />
                <input onClick={editDoc} type="button" defaultValue="Submit" />
                <div>{serverStatus}</div>
            </>
                : null}
        </>
    )
}
