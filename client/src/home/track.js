import React from 'react'

export default function Track ({tracks}){

    function YoutubeSearch(){
        var ytPath = "https://www.youtube.com/results?search_query="+ String(tracks.track_title) + String(tracks.artist_name)
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
            
        </div>
    <br/>
    </>)
}