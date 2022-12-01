import React, { useState } from 'react';
import GenresList from './genresList';
import './genres.css';

function GenresPage() {
  const [genres, setGenres] = useState([])

  function getGenres(e){
    setGenres(prevGenres => {
      return[{id: 1, name:'Genre 1', favourite: 0},{id: 2, name:'Genre 2', favourite: 1},{id: 3, name:'Genre 3', favourite: 1},{id: 4, name:'Genre 4', favourite: 0}]
    })
  }


  return (
    <div>
        <div id="genres">
          <h2>All Genres</h2>
          <label htmlFor="name">Genres:</label>
          <br />
          <button onClick={getGenres}>Get Genres</button>
          <GenresList genres = {genres}/>
        </div>
      </div>
  );
}

export default GenresPage;