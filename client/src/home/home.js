import React, { useState, useRef, useEffect } from 'react';
import TrackList from '../modules/trackList';
import ViewLists from '../modules/viewLists';
import ErrorDisplay from '../modules/errorDisplay';

function Home() {
  //states for the server status, tracks, and recent lists
  const [serverStatus, setServerStatus] = useState([])
  const [tracks, setTracks] = useState([])
  const [lists, setLists] = useState([])

  //user input refs
  const trackNameRef = useRef()
  const trackArtistRef = useRef()
  const trackGenreRef = useRef()

  //load the 10 most recent visible lists as soon as the page loads
  useEffect(() => {
    let ignore = false;

    if (!ignore) getLists()
    return () => { ignore = true; }
  }, []);

  //api call for getting the 10 most recent public lists
  async function getLists(e) {
    fetch('/api/lists/')
      .then(response => response.json())
      .then(data =>
        setLists(data))
  }

  //api call for searching by track using any combo of name, artist, and genre
  async function trackSearch(e) {
    const name = trackNameRef.current.value
    const artist = trackArtistRef.current.value
    const genre = trackGenreRef.current.value
    setTracks([])

    setServerStatus("Loading...")
    fetch('/api/tracks/trackSearch', {
      method: 'POST',
      headers: {
        'Accept': '/',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchName: name,
        searchArtist: artist,
        searchGenre: genre
      })
    }).then(response =>
      response.json())
      .then(data => {
        if (data.errors) {
          setServerStatus(`Error: ${data.errors[0].msg}`)
        } else {
          setServerStatus([])
          setTracks(data)
        }
      }
      )
  }

  return (
    <>
      <div>
        <h1>3316 Lab 4 - Homepage</h1>
      </div>
      <hr />
      <div id="tracks">
        <h2>Search for a track!</h2>
        <input ref={trackNameRef} type="text" name="trackName" placeholder="Track Name" />
        <input ref={trackArtistRef} type="text" name="trackArtist" placeholder="Artist Name" />
        <input ref={trackGenreRef} type="text" name="trackGenre" placeholder="Track Genre" />
        <input type="button" defaultValue="Search" onClick={trackSearch} />
      </div>
      <ErrorDisplay errors = {serverStatus}/>
      <TrackList tracks={tracks} />
      <hr />
      <div>
        <h2>Recent Public Playlists</h2>
        <button onClick={getLists}>Refresh</button>
        <hr />
        <ViewLists lists={lists} />
      </div>
    </>
  );
}

export default Home;
