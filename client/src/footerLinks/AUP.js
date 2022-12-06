import React, { useState, useRef, useEffect } from 'react';
import ErrorDisplay from '../modules/errorDisplay';


//function to show AUP with formatting 
export default function Docs() {
    const admin = localStorage.getItem("isAdmin");
    const [results, setResults] = React.useState({});
    const [editState, setEditState] = useState(false)
    const [serverStatus, setServerStatus] = useState([])


    const titleRef = useRef()
    const contentRef = useRef()

    var title = ""
    var content = ""
    title = results.title
    content = results.content

    //get AUP doc from database
    useEffect(() => {
        fetch("/api/docs/find/638bc20395dd56c0a23677cd")
            .then(res => res.json())
            .then(
                (result) => {
                    setResults(result);
                }
            )
    }, [])

    //edit AUP doc
    function editDoc() {
        const newName = titleRef.current.value
        const newContent = contentRef.current.value
        const newDoc = { title: newName, content: newContent }
        fetch('/api/docs/editdoc/638bc20395dd56c0a23677cd', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('x-auth-token')
            },
            body: JSON.stringify(newDoc)
        })
            .then(res => res.json())
            .then(data => {
                if (data.errors) {
                    setServerStatus(data.errors[0].msg)
                } else {
                    window.location.reload()
                }
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
                <hr></hr>
                <br />
                {admin === "true" ? <button onClick={() => setEditState(!editState)}>Edit</button> : null}
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
                        <ErrorDisplay errors={serverStatus} />
                    </div>
                )}
            </div>
        </>
    )
}