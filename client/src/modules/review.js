import React, { useState, useRef } from 'react';
import ErrorDisplay from './errorDisplay';

export default function Review ({reviews, listName}){
    //get the user's admin state
    const admin = localStorage.getItem("isAdmin");
    //user input ref
    const revPrivRef = useRef()
    //server state
    const [serverStatus, setServerStatus] = useState([])


    //api call to hide a given review
    async function hideReview(e) {
        const priv = revPrivRef.current.checked

        setServerStatus("Loading...")
        fetch('/api/admins/reviewvisability', {
            method: 'PUT',
            headers: {
                'Accept': '/',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('x-auth-token')
            },
            body: JSON.stringify({
                list: listName,
                username: reviews.username,
                hidden: priv
            })
        }).then(response =>
            response.json())
            .then(data => {
                if (data.errors) {
                    setServerStatus(`Error: ${data.errors[0].msg}`)
                } else {
                    setServerStatus(`Review visibility updated`)
                }
            }
            )
    }
    return(
        <>
        {/*Dont show hidden reviews*/}
        {!reviews.hidden ? 
        <div className="ReviewBox">
            <div>
                User: {reviews.username}
            </div>
            <div>
                Rating: {reviews.rating}
            </div>
            <div>
                Comment: {reviews.review}
            </div>
            <br/>
        </div>
         : null}
        {/*Admins can see an extra view for toggling review visibility*/}
        {admin === "true" ? <>
        <b>Admin Review Tools</b>
        <div>Review from {reviews.username}</div>
        <label htmlFor="changePriv">Hidden? </label>
        <input ref={revPrivRef} id = "changePriv" type="checkbox" defaultChecked = {reviews.hidden}/>
        <input type="button" onClick={hideReview} defaultValue="Save"/>
        <ErrorDisplay errors = {serverStatus}/>
        <br/>
        </> : null}
        <br/>
        </>
    )
}