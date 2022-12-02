import React from 'react'

export default function Track ({tracks}){
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
                Track Genres: {tracks.track_genres}
            </div>
            <div>
                Track ID: {tracks.track_id}
            </div>
            
        </div>
    <br/>
    </>)
}