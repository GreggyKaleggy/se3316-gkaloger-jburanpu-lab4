import React from "react";


export default function Genre ({genres}){
    return(
        <div>
            <div>
                Genre Name: {genres.title}
            </div>
            <br/>
            <div>
                Tracks: {genres.parent}
            </div>
            <br/>
            <div>
                Favourite: {genres.parent}
            </div>
            <br/>
        </div>
    )
}