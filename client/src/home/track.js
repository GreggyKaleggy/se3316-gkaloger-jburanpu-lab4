import React, { useState } from 'react';
import TrackInfo from './trackInfo'
const ytSearch = "https://www.youtube.com/results?search_query="

export default function Track ({tracks}){
    const [trackInfo, setTrackInfo] = useState([])
    const [expState, setExpState] = useState(false)

    async function GetTrackInfo(e){
        setExpState(true)
        fetch('/api/tracks/trackID/'+ String(tracks.track_id))
          .then(response => response.json())
          .then(data =>
            setTrackInfo(data))
    }

    function YoutubeSearch(e){
        var ytPath = ytSearch + String(tracks.track_title) + String(tracks.artist_name)
        window.open(ytPath,"_Blank")
    }

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
                <button onClick={YoutubeSearch}>Play</button>
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
            <button onClick={GetTrackInfo}>Show Track Info</button>
        </div>
        {expState ? <TrackInfo trackInfo = {trackInfo}/> : null}
    <br/>
    </>)
}