import React, { useEffect, useState } from "react"


const Docs = (props) => {
    const [results, setResults] = useState({})
    const id = props.id;

    useEffect(() => {
        fetch(`/api/docs/find/${id}`)
            .then(res => res.json())
            .then(data => {
                setResults(data);
            });
    }, [])

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
            <br />
        </>
    )
}

export default Docs;