import React, { useState, useRef } from 'react';
import TrackList from './trackList';
import ReviewList from './reviewList';
import ErrorDisplay from './errorDisplay';


export default function List ({list}){
    const login = localStorage.getItem("isLoggedIn");
    const [detState, setDetState] = useState(false)
    const [revState, setRevState] = useState(false)
    const [addRevState, setAddRevState] = useState(false)
    const [serverStatus, setServerStatus] = useState([])

    const revCommentRef = useRef()
    const revRatingRef = useRef()

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

    function confirmAddReview(e){
        if (!addRevState){
            setAddRevState(true)
        } else{
            setAddRevState(false)
        }
    }

    async function AddReview(e){
        const rating = revRatingRef.current.value
        const review = revCommentRef.current.value

    
        setServerStatus("Loading...")
        fetch('/api/lists/review', {
          method: 'POST',
          headers: {
            'Accept': '/',
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('x-auth-token')
          },
          body: JSON.stringify({
            name : list.name,
            rating: rating,
            review: review
          })
        }).then(response =>
          response.json())
          .then(data => {
            if (data.errors) {
              setServerStatus(`Error: ${data.errors[0].msg}`)
            } else {
              setServerStatus(`Review Added`)
            }
          }
          )
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
                <ReviewList reviews = {list.reviews} listName = {list.name}/>
                {login ?
                <>
                <h5>
                Add a Review:
                </h5>
                <ErrorDisplay errors = {serverStatus}/>
                <label htmlFor="revRating">Rating: </label>
                <input ref={revRatingRef} id = "revRating" type="text" placeholder="Review from 1-5"/>
                <br/>
                <label htmlFor="revComment">Comment: </label>
                <input ref={revCommentRef} id = "revComment" type="text" placeholder="Comment"/>
                <br/>
                {!addRevState ? <input type="button" onClick = {confirmAddReview} defaultValue="Submit Review"/> : null}
                {addRevState ?
                <>
                <div> Are you sure you want to add this review? </div> 
                <br/>
                <input type="button" onClick = {confirmAddReview} defaultValue="No"/>
                <input type="button" onClick = {AddReview} defaultValue="Yes"/>
                </> : null}
                <br/>
                </>
                :null }
            </div> : null}
        </div>
        <hr />
        <br/>
        </>
    )
}