import React, {useState, useRef} from "react";
import TrackList from '../modules/trackList';

export default function CreateList (){
    const login = localStorage.getItem("isLoggedIn");
    const [serverStatus, setServerStatus] = useState("")
    const [tracks, setTracks] = useState([])

    const listNameRef = useRef()
    const listDescriptionRef = useRef()
    const tracksListRef = useRef()
    const trackIDRef = useRef()

    async function trackIDSearch(e) {
      setServerStatus("Loading...")
      fetch('/api/tracks/trackID/'+trackIDRef.current.value)
        .then(response => response.json())
        .then(data =>{
          if (data.errors) {
            setTracks([])
            setServerStatus(`Error: ${data.errors[0].msg}`)
          } else {
            setServerStatus("")
            setTracks([data])
          }})
    }

    async function CreateList(e) {
        const name = listNameRef.current.value
        const desc = listDescriptionRef.current.value
        const track_ids = tracksListRef.current.value
    
        setServerStatus("Loading...")
        fetch('/api/lists/new', {
          method: 'POST',
          headers: {
            'Accept': '/',
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('x-auth-token')
          },
          body: JSON.stringify({
            name: name,
            desc: desc,
            track_ids: track_ids
          })
        }).then(response =>
          response.json())
          .then(data => {
            if (data.errors) {
              setServerStatus(`Error: ${data.errors[0].msg}`)
            } else {
              setServerStatus(`List created with name: ${data.name}`)
            }
          }
          )
      }

    return(
        <>
        {!login ?  <>
        <h2>You must be logged in to create a list!!</h2>
        </>
        : null}
        {login ?  <>
        <h2>Create a List!</h2>
        <hr/>
        <input ref={listNameRef} type="text" placeholder="List Name"/>
        <br/>
        <input ref={listDescriptionRef} type="text" placeholder="Description (Optional)"/>
        <br/>
        <input ref={tracksListRef} type="text" placeholder="Tracks"/>
        <br/>
        <input onClick={CreateList} type="button" defaultValue="Submit"/>
        <div>{serverStatus}</div>
        <h2>Search for a track by ID!</h2>
        <input ref={trackIDRef} type="text" name="trackID" placeholder="Track ID" />
        <input type="button" defaultValue="Search" onClick={trackIDSearch} />
        <TrackList tracks={tracks} />
        </>
        : null}
        </>
    )
}