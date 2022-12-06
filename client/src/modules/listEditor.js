import React, { useState, useRef } from 'react';

export default function ListEditor ({list}){
    const [editState, setEditState] = useState(false)
    const [serverStatus, setServerStatus] = useState("")
    const listName = list.name

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

    async function EditList(e) {
        const name = listNameRef.current.value
        const desc = listDescriptionRef.current.value
        const track_ids = tracksListRef.current.value
    
        setServerStatus("Loading...")
        fetch('/api/lists/editlist', {
          method: 'PUT',
          headers: {
            'Accept': '/',
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('x-auth-token')
          },
          body: JSON.stringify({
            name : listName,
            newName: name,
            newDesc: desc
          })
        }).then(response =>
          response.json())
          .then(data => {
            if (data.errors) {
              setServerStatus(`Error: ${data.errors[0].msg}`)
            } else {
              setServerStatus(`List ${listName} Updated!`)
            }
          }
          )
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
            <div>{serverStatus}</div>
            {editState ? 
            <>
            <br/>
            <label for="listName">List Name: </label>
            <input ref={listNameRef} id = "listName" type="text" placeholder="List Name" defaultValue={list.name}/>
            <br/>
            <label for="listDesc">List Description: </label>
            <input ref={listDescriptionRef} id = "listDesc" type="text" placeholder="Description (Optional)" defaultValue = {list.desc}/>
            <br/>
            <label for="trackIDs">Track IDs: </label>
            <input ref={tracksListRef} id = "trackIDs" type="text" placeholder="Tracks" defaultValue = {trackIDs}/>
            <br/>
            <input type="button" onClick = {EditList} defaultValue="Submit"/>
            </> 
            : null}

        </div>
        <br/>
        </>
    )
}