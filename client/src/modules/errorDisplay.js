import React from 'react'

export default function ErrorDisplay ({errors}){
    //convert strings to an array to make sure the ycan be proccessed
    if (typeof errors === 'string'){
        errors = [errors]
    }
    //return each element as a div
    return(
            errors.map(error => {
                return <div> - {error}</div>
            })
    )
}