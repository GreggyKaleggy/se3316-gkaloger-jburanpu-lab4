import React from 'react'
import Review from './review'

export default function reviewList ({reviews, listName}){
    return(
            reviews.map(reviews => {
                return <Review key= {reviews._id} reviews = {reviews} listName = {listName}/>
            })
    )
}