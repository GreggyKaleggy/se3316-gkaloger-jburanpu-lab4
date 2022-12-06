import React, { useState, useRef } from 'react';
import TrackList from './trackList';
import ReviewList from './reviewList';
import ErrorDisplay from './errorDisplay';


export default function List ({list}){
    //get the user's logged in state
    const login = localStorage.getItem("isLoggedIn");

    //states for details, reviews, adding reviews, and server status
    const [detState, setDetState] = useState(false)
    const [revState, setRevState] = useState(false)
    const [addRevState, setAddRevState] = useState(false)
    const [serverStatus, setServerStatus] = useState([])

    //user input refs
    const revCommentRef = useRef()
    const revRatingRef = useRef()

    //toggle for showing / hiding details
    function showDetails(e){
        if (!detState){
            setDetState(true)
        } else{
            setDetState(false)
        }
    }
    //toggle for showing / hiding reviews
    function showReviews(e){
        if (!revState){
            setRevState(true)
        } else{
            setRevState(false)
        }
    }
    //toggle for showing / hiding adding a review
    function confirmAddReview(e){
        if (!addRevState){
            setAddRevState(true)
        } else{
            setAddRevState(false)
        }
    }

    //api call for adding a review using rating and comment
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
              setServerStatus(data.errors[0].msg)
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
            {/*Hide the details if toggled*/}
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
            {/*Hide the reviews if toggled*/}
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
                {/*confirmation for adding a review*/}
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