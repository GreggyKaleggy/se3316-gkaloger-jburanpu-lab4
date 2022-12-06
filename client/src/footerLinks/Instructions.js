import React, { useEffect } from "react";



export default function Docs() {
    const [results, setResults] = React.useState({});
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

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
                    setIsLoaded(true);
                    setResults(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
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