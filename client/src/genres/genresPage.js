import React from 'react';
import './genres.css';

function GenresPage() {
  return (
    <div>
        <div id="genres">
          <h2>All Genres</h2>
          <form>
            <label htmlFor="name">Genres:</label>
            <br />
            <input type="button" defaultValue="Get Genres" onclick="getArtistbyName(document.getElementById('name').value)" />
          </form>
        </div>
      </div>
  );
}

export default GenresPage;