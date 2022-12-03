import React from "react";


export default function Review ({reviews}){
    return(
        <>
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
        
        </>
    )
}