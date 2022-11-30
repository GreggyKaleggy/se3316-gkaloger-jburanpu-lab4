import React from 'react';
import './tracks.css';

function TracksPage() {
  return (
    <div>
        <div id="tracks">
          <h2>Search track by ID</h2>
          <form>
            <label htmlFor="trackID">Track ID:</label>
            <br />
            <input type="text" id="trackID" name="trackID" />
            <br />
            <input type="button" defaultValue="Search" onclick="getTrack(document.getElementById('trackID').value)" />
          </form>
        </div>
        <div id="title">
          <h2>Search Track by track title or album name</h2>
          <h3>Showing maximum of 20 results</h3>
          <form>
            <label htmlFor="searchTitle">Search by Title:</label>
            <br />
            <input type="text" id="searchTitle" name="searchTitle" />
            <br />
            <input type="button" defaultValue="Search" onclick="searchbyTitle(document.getElementById('searchTitle').value)" />
          </form>
        </div>
        <h3>Search Results</h3>
        <div id="results" />
    </div>
  );
}

export default TracksPage;