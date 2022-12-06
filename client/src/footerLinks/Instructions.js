import React, { useEffect } from "react";


//function to show instructions with formatting
export default function Docs() {
    const [results, setResults] = React.useState({});

    //get request to show instructions for DMCA notices
    useEffect(() => {
        fetch('/api/docs/instructions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('x-auth-token')
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setResults(result);
                }
            )
    }, [])



    return (
        <>
            <div>
                <div>
                    <h3>{results.title}</h3><br />
                </div>
                <div>
                    <p>{results.content}</p><br />
                </div>
                <div>
                    <h3>Modified On</h3><br />{results.modified}
                </div>
            </div>
            <br />
        </>
    )
}