import React, { useState } from 'react';
import TrackInfo from './trackInfo'
const ytSearch = "https://www.youtube.com/results?search_query="

export default function Track ({tracks}){
    //states for track info and info expansion
    const [trackInfo, setTrackInfo] = useState([])
    const [expState, setExpState] = useState(false)

    //get the additional track info when the view is expanded
    async function GetTrackInfo(e){
        if (!expState){
            setExpState(true)
            if (trackInfo.length === 0){
                fetch('/api/tracks/trackID/'+ String(tracks.track_id))
                    .then(response => response.json())
                    .then(data =>
                setTrackInfo(data))
                }
        } else{
            setExpState(false)
        }
    }

    //function for opening a new tab with a youtube search containing the video details
    function YoutubeSearch(e){
        var ytPath = ytSearch + String(tracks.track_title) + String(tracks.artist_name)
        window.open(ytPath,"_Blank")
    }

    var genres = []
    //parse the genres data so it displays nicely. Extract all the genre titles
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
        {/*show the track info when expanded*/}
        {expState ? <TrackInfo trackInfo = {trackInfo}/> : null}
    <br/>
    </>)
}