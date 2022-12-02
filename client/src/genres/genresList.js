import React from 'react'
import Genre from './genre'

export default function GenreList ({genres}){
    return(
            genres.map(genres => {
                return <Genre key= {genres.genre_id} genres = {genres}/>
            })
    )
}