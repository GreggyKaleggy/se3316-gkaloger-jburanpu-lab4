import React, {useState, useRef} from 'react';
import './home.css';

function Home() {
  const trackNameRef = useRef()
  const trackArtistRef = useRef()
  const trackGenreRef = useRef()

  function trackSearch(e){

  }

  return (
    <>
    <div>
      <h1>3316 Lab 4 - Homepage</h1>
      <h2>All navigation link information shown below</h2>
      <hr />
      <h2>Genres</h2>
      <h3>Get a list of all music genres, with IDs and titles</h3>
      <h2>Lists</h2>
      <h3>Make a new list, check existing lists, and see information such as list duration and track IDs in that list</h3>
      <h2>Artists</h2>
      <h3>See a list of all artists, search for artists using name or ID</h3>
      <h2>Tracks</h2>
      <h3>Search a specific ID to get track information or search for a certain track or album title to get track ID</h3>
    </div>
    <hr />
    <div id="tracks">
          <h2>Search for a track!</h2>
            <input ref = {trackNameRef} type="text" name="trackName" placeholder="Track Name"/>
            <input ref = {trackArtistRef} type="text" name="trackArtist" placeholder="Artist Name"/>
            <input ref = {trackGenreRef} type="text" name="trackGenre" placeholder="Track Genre"/>
            <input type="button" defaultValue="Search" onClick={trackSearch()} />
    </div>
    </>
  );
}

export default Home;
