import React, { useState } from 'react';
import TrackList from './trackList';
import ReviewList from './reviewList';


export default function List ({list}){
    const [detState, setDetState] = useState(false)
    const [revState, setRevState] = useState(false)

    function showDetails(e){
        if (!detState){
            setDetState(true)
        } else{
            setDetState(false)
        }
    }
    function showReviews(e){
        if (!revState){
            setRevState(true)
        } else{
            setRevState(false)
        }
    }

    return(
        <>
        <div className="ListBox">
            <div>
                List Name: {list.name}
            </div>
            <div>
                List Creator: {list.username}
            </div>
            <div>
                Tracks: {list.tracklist.length}
            </div>
            <div>
                Duration: {list.duration} Minutes
            </div>
            <div>
                Average Rating: {list.averageRating}
            </div>
            <div>
                Last Modified: {list.modified}
            </div>
            
            <button onClick={showDetails}>View Details</button> 
            <button onClick= {showReviews}>View Reviews</button>
            {detState ? <div>
                <h4>Additional Details</h4>
                <div>
                Description: {list.desc}
                </div>
                <div>
                Private List: {String(list.isPrivate)}
                </div>
                <h4>
                Track List: 
                </h4>
                <TrackList tracks = {list.tracklist}/>
            </div> : null}
            {revState ? <div>
                <h4>
                Reviews: 
                </h4>
                <ReviewList reviews = {list.reviews}/>
            </div> : null}
        </div>
        <hr />
        <br/>
        </>
    )
}