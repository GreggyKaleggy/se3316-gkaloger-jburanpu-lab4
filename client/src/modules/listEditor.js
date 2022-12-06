import React from "react";


export default function ListEditor ({list}){
    return(
        <>
        <div className="EditBox">
            <div>
                List Name: {list.name}
            </div>
            <div>
                Number of Tracks: {list.numberofTracks}
            </div>
        </div>
        <br/>
        </>
    )
}