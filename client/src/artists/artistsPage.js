import React from 'react';
import './artists.css';

function ArtistsPage() {
  return (
    <div>
        <div id="artists">
          <h2>Search artist by ID</h2>
          <form>
            <label htmlFor="artistID">Artist ID:</label>
            <br />
            <input type="text" id="artistID" name="artistID" />
            <br />
            <input type="button" defaultValue="Search" onclick="getArtistbyId(document.getElementById('artistID').value)" />
          </form>
        </div>
        <div id="artistName">
          <h2>Search Artist by Name</h2>
          <form>
            <label htmlFor="name">Artist Name:</label>
            <br />
            <input type="text" id="name" name="name" />
            <br />
            <input type="button" defaultValue="Search" onclick="getArtistbyName(document.getElementById('name').value)" />
          </form>
        </div>
        <h2>Results</h2>
        <div id="results">
        </div>
        <br />
        <div id="allArtists">
          <h2>First 100 Artists</h2>
          <form>
            <label htmlFor="name">Artists:</label>
            <br />
            <input type="button" defaultValue="Get Artists" onclick="" />
          </form>
        </div>
      </div>
  );
}

export default ArtistsPage;