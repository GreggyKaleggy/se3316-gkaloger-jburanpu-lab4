import React, { useState } from 'react';


export default function List ({list}){
    const [detState, setDetState] = useState(false)

    function showDetails(e){
        if (!detState){
            setDetState(true)
        } else{
            setDetState(false)
        }
    }

    return(
        <>
        <div className="ListBox">
            <div>
                List Name: {list.name}
            </div>
            <div>
                List Creator: {list.username}
            </div>
            <div>
                Tracks: {list.tracklist.length}
            </div>
            <div>
                Duration: {list.duration}
            </div>
            <div>
                Average Rating: {list.averageRating}
            </div>
            <div>
                Last Modified: {list.modified}
            </div>
            
            <button onClick={showDetails}>View Details</button> 
            <button>View Reviews</button>
            {detState ? <div>
                <div>
                Description: {list.desc}
                </div>
            </div> : null}
        </div>
        <br/>
        </>
    )
}