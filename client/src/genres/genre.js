import React from "react";


export default function Genre ({genres}){
    return(
        <>
        <div className="GenreBox">
            <div>
                Genre Name: {genres.title}
            </div>
            <div>
                Genre ID: {genres.genre_id}
            </div>
            <div>
                Parent Genre ID: {genres.parent}
            </div>
            <div>
                Number of tracks in Genre: {genres["#tracks"]}
            </div>
            
        </div>
        <br/>
        </>
    )
}