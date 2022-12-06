import React, { useState, useRef, useEffect } from 'react';
import jwt_decode from 'jwt-decode';


export default function Docs() {
    const admin = localStorage.getItem("isAdmin");
    const [results, setResults] = React.useState({});
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [editState, setEditState] = useState(false)

    const titleRef = useRef()
    const contentRef = useRef()

    var title = ""
    var content = ""
    title = results.title
    content = results.content

    useEffect(() => {
        fetch("/api/docs/find/638e6f91e86ca3056346be0a")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setResults(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    function editDoc() {
        const newName = titleRef.current.value
        const newContent = contentRef.current.value
        const newDoc = { title: newName, content: newContent }
        fetch('/api/docs/editdoc/638e6f91e86ca3056346be0a', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('x-auth-token')
            },
            body: JSON.stringify(newDoc)
        })
            .then(res => res.json())
            .then(data => {
                window.location.reload()
            })
    }

    return (
        <>
            <div>
                <div>
                    <h3>Document Title</h3> <br></br>{results.title}
                </div>
                <div>
                    <h3>Content</h3> <br></br>{results.content}
                </div>
                <div>
                    <h3>Modified On</h3> <br></br>{results.modified}
                </div>
            </div>
            <hr />
            <br />
            <div className="EditBox">
                {admin ? <button onClick={() => setEditState(!editState)}>Edit</button> : null}
                {editState && (
                    <div>
                        <h2>Edit Document</h2>
                        <div>
                            <label htmlFor="title">Title</label>
                            <br />
                            <input type="text" id="title" ref={titleRef} defaultValue={title} />
                            <br />
                            <label htmlFor="content">Content</label>
                            <br />
                            <input type="text" id="content" ref={contentRef} defaultValue={content} />
                            <br />
                            <button onClick={editDoc}>Save</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}