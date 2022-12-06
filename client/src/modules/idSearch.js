import React, {useState, useRef} from "react";
import TrackList from '../modules/trackList';
import ErrorDisplay from "./errorDisplay";


export default function IDSearch (){
    const trackIDRef = useRef()
    const [tracks, setTracks] = useState([])
    const [serverStatus, setServerStatus] = useState([])

    async function trackIDSearch(e) {
      setServerStatus("Loading...")
      fetch('/api/tracks/trackID/'+trackIDRef.current.value)
        .then(response => response.json())
        .then(data =>{
          if (data.errors) {
            setTracks([])
            setServerStatus(`Error: ${data.errors[0].msg}`)
          } else {
            setServerStatus([])
            setTracks([data])
          }})
    }
    return(
        <>
        <h2>Search for a track by ID!</h2>
        <input ref={trackIDRef} type="text" name="trackID" placeholder="Track ID" />
        <input type="button" defaultValue="Search" onClick={trackIDSearch} />
        <ErrorDisplay errors = {serverStatus}/>
        <TrackList tracks={tracks} />
        </>
    )
}