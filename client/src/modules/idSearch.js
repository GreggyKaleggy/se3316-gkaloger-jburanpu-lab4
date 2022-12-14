import React, {useState, useRef} from "react";
import TrackList from '../modules/trackList';
import ErrorDisplay from "./errorDisplay";


export default function IDSearch (){
    //user input ref
    const trackIDRef = useRef()
    //states for tracks and server status
    const [tracks, setTracks] = useState([])
    const [serverStatus, setServerStatus] = useState([])

    //api call for getting a track by ID
    async function trackIDSearch(e) {
      setServerStatus("Loading...")
      fetch('/api/tracks/trackID/'+trackIDRef.current.value)
        .then(response => response.json())
        .then(data =>{
          if (data.errors) {
            setTracks([])
            setServerStatus(data.errors[0].msg)
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