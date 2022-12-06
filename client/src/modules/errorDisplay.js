import React from 'react'

export default function ErrorDisplay ({errors}){
    if (typeof errors === 'string'){
        errors = [errors]
    }
    return(
            errors.map(error => {
                return <div> - {error}</div>
            })
    )
}