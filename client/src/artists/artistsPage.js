import React from 'react';
import './artists.css';

function ArtistsPage() {
  return (
    <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Artists</title>
        <link rel="stylesheet" href="styles.css" />
        <div className="topnav">
          <a href="./index.html">Home</a>
          <a href="./genres.html">Genres</a>
          <a href="./lists.html">Lists</a>
          <a className="active" href="./artists.html">Artists</a>
          <a href="./tracks.html">Tracks</a>
        </div>
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
            <input type="button" defaultValue="Get Artists" onclick="getArtistbyName(document.getElementById('name').value)" />
          </form>
        </div>
      </div>
  );
}

export default ArtistsPage;