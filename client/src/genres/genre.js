import React from "react";


export default function Genre ({genres}){
    return(
        <div>
            <div>
                Genre Name: {genres.name}
            </div>
            <br/>
            <div>
                Genre ID: {genres.id}
            </div>
            <br/>
            <div>
                Favourite: {genres.favourite}
            </div>
            <br/>
        </div>
    )
}