import React, { useState } from 'react';
import GenresList from './genresList';
import './genres.css';

function GenresPage() {
  const [genres, setGenres] = useState([])

  function GetGenres(e){
      fetch('/api/genres')
        .then(response => response.json())
        .then(data =>
          setGenres(data))
  }


  return (
    <div>
        <div id="genres">
          <h2>All Genres</h2>
          <label htmlFor="name">Genres:</label>
          <br />
          <button onClick={GetGenres}>Get Genres</button>
          <GenresList genres = {genres}/>
        </div>
      </div>
  );
}

export default GenresPage;