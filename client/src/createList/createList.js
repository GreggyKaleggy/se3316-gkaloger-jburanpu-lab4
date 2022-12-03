import React from "react";


export default function CreateList (){
    return(
        <>
        <h2>Create a List!</h2>
        <hr/>
        <input type="text" name="trackName" placeholder="List Name"/>
        <br/>
        <input type="text" name="trackArtist" placeholder="Description (Optional)"/>
        <br/>
        <input type="text" name="trackGenre" placeholder="Track Genre"/>
        <br/>
        <input type="button" defaultValue="Search"/>
        </>
    )
}