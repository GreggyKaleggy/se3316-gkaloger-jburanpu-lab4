import React, { useEffect } from "react";


export default function Docs() {
    /*
    var docs
    function getDocs(e) {
        fetch('/api/docs/find/AUP')
            .then(response => response.json())
            .then(data =>
                docs = data)
    }
    

    useEffect(() => {
        let ignore = false;

        if (!ignore) getDocs()
        return () => { ignore = true; }
    }, []);

    */

    return (
        <>
            <div>
                <div>
                    Document Title:
                </div>
                <div>
                    Content:
                </div>
                <div>
                    Modified On:
                </div>
            </div>
            <br />
        </>
    )
}