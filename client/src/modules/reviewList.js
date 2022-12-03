import React from 'react'
import Review from './review'

export default function reviewList ({reviews}){
    return(
            reviews.map(reviews => {
                return <Review key= {reviews.track_id} reviews = {reviews}/>
            })
    )
}