import React, { useEffect } from "react";


export default function Docs() {
    const [results, setResults] = React.useState({});
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    useEffect(() => {
        fetch("/api/docs/find/Acceptable Use Policy")
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
                    Document Title: {results.title}
                </div>
                <div>
                    Content: {results.content}
                </div>
                <div>
                    Modified On: {results.modified}
                </div>
            </div>
            <br />
        </>
    )
}