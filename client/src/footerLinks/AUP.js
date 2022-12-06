import React, { useEffect } from "react";


export default function Docs() {
    const [results, setResults] = React.useState({});
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    useEffect(() => {
        fetch("/api/docs/find/638bc20395dd56c0a23677cd")
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
                <button><a href="/EditAUP">Edit Document</a></button>
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