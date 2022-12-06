import React from "react";


export default function TrackInfo ({trackInfo}){
    //display track info for a given track
    return(
        <>
        <div className="InfoBox">
            <div>
                Track Duration: {trackInfo.track_duration}
            </div>
            <div>
                Album Name: {trackInfo.album_title}
            </div>
            <div>
                Album Track Number: {trackInfo.track_number}
            </div>
            <div>
                Track Created: {trackInfo.track_date_created}
            </div>
            <div>
                Track Recorded: {trackInfo.track_date_recorded}
            </div>
            <div>
                Tags: {trackInfo.tags}
            </div>
        </div>
        </>
    )
}