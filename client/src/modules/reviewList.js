import React from 'react'
import Review from './review'

export default function reviewList ({reviews, listName}){
    //return each review as a Reviw element, make sure the list name is still assigned
    return(
            reviews.map(reviews => {
                return <Review key= {reviews._id} reviews = {reviews} listName = {listName}/>
            })
    )
}