import React from 'react'

export default function Track ({tracks}){
    var genres = []
    if (tracks.track_genres !== ""){
        var genreData = JSON.parse(String(tracks.track_genres).replace(/'/g, '"'))
        for (let i = 0; i < Object.keys(genreData).length; i++){
            if (i === 0){
                genres[i] = genreData[i].genre_title
            } else {
                genres[i] = " " + genreData[i].genre_title
            }
            
        }
    } else {
        genres = "No Genres Given"
    }
    
    
    


    return(
    <>
    <div className="TrackBox">
            <div>
                Track Name: {tracks.track_title}
            </div>
            <div>
                Artist / Band Name: {tracks.artist_name}
            </div>
            <div>
                Track Genres: {String(genres)}
            </div>
            <div>
                Track ID: {tracks.track_id}
            </div>
            
        </div>
    <br/>
    </>)
}