import React, { useState, useRef } from 'react';
import ErrorDisplay from './errorDisplay';

export default function ListEditor({ list }) {
  //states for editing a list, deleting a list, and the server status
  const [editState, setEditState] = useState(false)
  const [delState, setDelState] = useState(false)
  const [serverStatus, setServerStatus] = useState([])

  //save the list name           
  const listName = list.name

  //user input refs
  const listNameRef = useRef()
  const listDescriptionRef = useRef()
  const tracksAddRef = useRef()
  const tracksDelRef = useRef()
  const listPrivRef = useRef()

  //parse the list of track ids to be seperated by spaces
  var trackIDs = ""
  list.tracklist.forEach(t => trackIDs = trackIDs + String(t.track_id) + " ")

  //toggle for displaying edit details
  async function ToggleEdit(e) {
    if (!editState) {
      setEditState(true)
    } else {
      setEditState(false)
    }
  }

  //toggle for displaying delete details
  async function ToggleDelete(e) {
    if (!delState) {
      setDelState(true)
    } else {
      setDelState(false)
    }
  }

  //api call for editing a list's name and description
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
        name: listName,
        newName: name,
        newDesc: desc
      })
    }).then(response =>
      response.json())
      .then(data => {
        if (data.errors) {
          setServerStatus(data.errors[0].msg)
        } else {
          setServerStatus(`List ${listName} Updated!`)
        }
      }
      )
  }

  //api call for adding tracks via a list of track IDS
  async function AddTracks(e) {
    const track_ids = tracksAddRef.current.value

    fetch('/api/lists/addTracks', {
      method: 'PUT',
      headers: {
        'Accept': '/',
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('x-auth-token')
      },
      body: JSON.stringify({
        name: listName,
        track_ids: track_ids
      })
    }).then(response =>
      response.json())
      .then(data => {
        if (data.errors) {
          setServerStatus(data.errors[0].msg)
        } else {
          setServerStatus(`List ${listName} Updated!`)

        }
      }
      )
  }

  //api call for deleting tracks via a list of track IDS
  async function DeleteTracks(e) {
    const track_ids = tracksDelRef.current.value

    fetch('/api/lists/deleteTracks', {
      method: 'DELETE',
      headers: {
        'Accept': '/',
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('x-auth-token')
      },
      body: JSON.stringify({
        name: listName,
        track_ids: track_ids
      })
    }).then(response =>
      response.json())
      .then(data => {
        if (data.errors) {
          setServerStatus(data.errors[0].msg)
        } else {
          setServerStatus(`List ${listName} Updated!`)

        }
      }
      )
  }

  //api call to change the privacy of a given list
  async function ChangePriv(e) {
    const priv = listPrivRef.current.checked

    fetch('/api/lists/changePrivacy', {
      method: 'PUT',
      headers: {
        'Accept': '/',
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('x-auth-token')
      },
      body: JSON.stringify({
        name: listName,
        value: priv
      })
    }).then(response =>
      response.json())
      .then(data => {
        if (data.errors) {
          setServerStatus(data.errors[0].msg)
        } else {
          setServerStatus(`List ${listName} Updated!`)

        }
      }
      )
  }

  //api call to delete a given list
  async function DeleteList(e) {
    fetch('/api/lists/deleteList', {
      method: 'DELETE',
      headers: {
        'Accept': '/',
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('x-auth-token')
      },
      body: JSON.stringify({
        name: listName
      })
    }).then(response =>
      response.json())
      .then(data => {
        if (data.errors) {
          setServerStatus(data.errors[0].msg)
        } else {
          setServerStatus(`List ${listName} Deleted!`)
          window.location.reload(false);
        }
      }
      )
  }

  return (
    <>
      <div className="EditBox">
        <div>
          List Name: {list.name}
        </div>
        <div>
          Number of Tracks: {list.numberofTracks}
        </div>
        <button onClick={ToggleEdit}>Edit List</button>
        {editState ?
          <>
            <br />
            <br />
            <b>Edit Name and Description</b>
            <br />
            <label htmlFor="listName">List Name: </label>
            <input ref={listNameRef} id="listName" type="text" placeholder="List Name" defaultValue={list.name} />
            <br />
            <label htmlFor="listDesc">List Description: </label>
            <input ref={listDescriptionRef} id="listDesc" type="text" placeholder="Description (Optional)" defaultValue={list.desc} />
            <br />
            <input type="button" onClick={EditList} defaultValue="Save" />
            <br />
            <br />
            <b>Edit Tracks</b>
            <br />
            <div>Track IDs: {trackIDs}</div>
            <label htmlFor="addIDs">Add tracks by ID: </label>
            <input ref={tracksAddRef} id="addIDs" type="text" placeholder="Track IDs" />
            <input type="button" onClick={AddTracks} defaultValue="Add" />
            <br />
            <label htmlFor="delIDs">Delete tracks by ID: </label>
            <input ref={tracksDelRef} id="delIDs" type="text" placeholder="Track IDs" />
            <input type="button" onClick={DeleteTracks} defaultValue="Delete" />
            <br />
            <br />
            <b>Edit Privacy</b>
            <br />
            <label htmlFor="changePriv">Private? </label>
            <input ref={listPrivRef} id="changePriv" type="checkbox" defaultChecked={list.isPrivate} />
            <input type="button" onClick={ChangePriv} defaultValue="Save" />
            <br />
            <br />
            <b>Delete List</b>
            <br />
            {!delState ? <input type="button" onClick={ToggleDelete} defaultValue="Delete" /> : null}
            {/*Delete list confirmation*/}
            {delState ?
              <>
                <div> Are you sure you want to delete this list? </div>
                <b>THIS CANNOT BE UNDONE</b>
                <br />
                <input type="button" onClick={ToggleDelete} defaultValue="No" />
                <input type="button" onClick={DeleteList} defaultValue="Yes" />
              </>
              : null}

            <ErrorDisplay errors={serverStatus} />
          </>
          : null}

      </div>
      <hr />
    </>
  )
}