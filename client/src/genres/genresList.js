import React from 'react'
import Genre from './genre'

export default function genreList ({genres}){
    return(
            genres.map(genres => {
                return <Genre key= {genres.genre_id} genres = {genres}/>
            })
    )
}