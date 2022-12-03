import React, {useState, useRef, useEffect} from 'react';
import './home.css';
import TrackList from '../modules/trackList';
import ViewLists from '../modules/viewLists';

function Home() {
  const [serverStatus, setServerStatus] = useState("")
  const [tracks, setTracks] = useState([])
  const [lists, setLists] = useState([])
  
  const trackNameRef = useRef()
  const trackArtistRef = useRef()
  const trackGenreRef = useRef()

  useEffect(() => {
    let ignore = false;
    
    if (!ignore)  getLists()
    return () => { ignore = true; }
    },[]);

  async function getLists(e){
        fetch('/api/lists/')
          .then(response => response.json())
          .then(data =>
            setLists(data))
  }

  async function trackSearch(e){
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
      .then(data =>{
        if (data.errors){
          setServerStatus(`Error: ${data.errors[0].msg}`)
        } else {
          setServerStatus("")
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
            <input ref = {trackNameRef} type="text" name="trackName" placeholder="Track Name"/>
            <input ref = {trackArtistRef} type="text" name="trackArtist" placeholder="Artist Name"/>
            <input ref = {trackGenreRef} type="text" name="trackGenre" placeholder="Track Genre"/>
            <input type="button" defaultValue="Search" onClick={trackSearch} />
    </div>
    <div>{serverStatus}</div>
    <TrackList tracks = {tracks}/>
    <hr />
    <div>
    <h2>Recent Public Playlists</h2>
    <button onClick = {getLists}>Refresh</button>
    <hr/>
    <ViewLists lists = {lists}/>
    </div>
    </>
  );
}

export default Home;
