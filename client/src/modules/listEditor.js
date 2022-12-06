import React, { useState, useRef } from 'react';

export default function ListEditor ({list}){
    const [editState, setEditState] = useState(false)

    const listNameRef = useRef()
    const listDescriptionRef = useRef()
    const tracksListRef = useRef()

    var trackIDs = ""
    list.tracklist.forEach(t => trackIDs = trackIDs + String(t.track_id) + " ")

    async function ToggleEdit(e){
        if (!editState){
            setEditState(true)
        } else{
            setEditState(false)
        }
    }

    return(
        <>
        <div className="EditBox">
            <div>
                List Name: {list.name}
            </div>
            <div>
                Number of Tracks: {list.numberofTracks}
            </div>
            <button onClick = {ToggleEdit}>Edit List</button>
            {editState ? 
            <>
            <br/>
            <label for="listName">List Name: </label>
            <input ref={listNameRef} id = "listName" type="text" placeholder="List Name" value={list.name}/>
            <br/>
            <label for="listDesc">List Description: </label>
            <input ref={listDescriptionRef} id = "listDesc" type="text" placeholder="Description (Optional)" value = {list.desc}/>
            <br/>
            <label for="trackIDs">Track IDs: </label>
            <input ref={tracksListRef} id = "trackIDs" type="text" placeholder="Tracks" value = {trackIDs}/>
            <br/>
            <input type="button" defaultValue="Submit"/>
            </> 
            : null}

        </div>
        <br/>
        </>
    )
}