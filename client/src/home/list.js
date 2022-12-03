import React from "react";


export default function List ({list}){
    return(
        <>
        <div className="ListBox">
            <div>
                List Name: {list.name}
            </div>
            <div>
                List Duration: {list.duration}
            </div>
            <div>
                List Description: {list.desc}
            </div>
            <div>
                Last Modified: {list.modified}
            </div>
            
        </div>
        <br/>
        </>
    )
}