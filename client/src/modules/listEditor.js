import React, { useState, useRef } from 'react';
import ErrorDisplay from './errorDisplay';

export default function ListEditor ({list}){
    const [editState, setEditState] = useState(false)
    const [serverStatus, setServerStatus] = useState([])
    
                
    const listName = list.name

    const listNameRef = useRef()
    const listDescriptionRef = useRef()
    const tracksAddRef = useRef()
    const tracksDelRef = useRef()
    const listPrivRef = useRef()

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

      async function AddTracks (e){
        const track_ids = tracksAddRef.current.value

        fetch('/api/lists/addTracks', {
            method: 'PUT',
            headers: {
              'Accept': '/',
              'Content-Type': 'application/json',
              'x-auth-token': localStorage.getItem('x-auth-token')
            },
            body: JSON.stringify({
              name : listName,
              track_ids: track_ids
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

      async function DeleteTracks (e){
        const track_ids = tracksDelRef.current.value

        fetch('/api/lists/deleteTracks', {
            method: 'DELETE',
            headers: {
              'Accept': '/',
              'Content-Type': 'application/json',
              'x-auth-token': localStorage.getItem('x-auth-token')
            },
            body: JSON.stringify({
              name : listName,
              track_ids: track_ids
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

      async function ChangePriv (e){
        const priv = listPrivRef.current.checked

        fetch('/api/lists/changePrivacy', {
            method: 'PUT',
            headers: {
              'Accept': '/',
              'Content-Type': 'application/json',
              'x-auth-token': localStorage.getItem('x-auth-token')
            },
            body: JSON.stringify({
              name : listName,
              value: priv
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
            {editState ? 
            <>
            <br/>
            <br/>
            <b>Edit Name and Description</b>
            <br/>
            <label htmlFor="listName">List Name: </label>
            <input ref={listNameRef} id = "listName" type="text" placeholder="List Name" defaultValue={list.name}/>
            <br/>
            <label htmlFor="listDesc">List Description: </label>
            <input ref={listDescriptionRef} id = "listDesc" type="text" placeholder="Description (Optional)" defaultValue = {list.desc}/>
            <br/>
            <input type="button" onClick = {EditList} defaultValue="Save"/>
            <br/>
            <br/>
            <b>Edit Tracks</b>
            <br/>
            <div>Track IDs: {trackIDs}</div>
            <label htmlFor="addIDs">Add tracks by ID: </label>
            <input ref={tracksAddRef} id = "addIDs" type="text" placeholder="Track IDs"/>
            <input type="button" onClick = {AddTracks} defaultValue="Add"/>
            <br/>
            <label htmlFor="delIDs">Delete tracks by ID: </label>
            <input ref={tracksDelRef} id = "delIDs" type="text" placeholder="Track IDs"/>
            <input type="button" onClick = {DeleteTracks} defaultValue="Delete"/>
            <br/>
            <br/>
            <b>Edit Privacy</b>
            <br/>
            <label htmlFor="changePriv">Private? </label>
            <input ref={listPrivRef} id = "changePriv" type="checkbox" defaultChecked = {list.isPrivate}/>
            <input type="button" onClick = {ChangePriv} defaultValue="Save"/>
            <br/>
            <ErrorDisplay errors = {serverStatus}/>
            </> 
            : null}

        </div>
        <br/>
        </>
    )
}