import React from "react";


export default function CreateList (){
    return(
        <>
        <h2>Create a List!</h2>
        <hr/>
        <input type="text" placeholder="List Name"/>
        <br/>
        <input type="text" placeholder="Description (Optional)"/>
        <br/>
        <input type="text" placeholder="Tracks"/>
        <br/>
        <input type="button" defaultValue="Submit"/>
        </>
    )
}