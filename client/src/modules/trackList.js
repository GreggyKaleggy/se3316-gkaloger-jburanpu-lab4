import React from 'react'
import Track from './track'

export default function trackList ({tracks}){
    //return a Track element for each track
    return(
            tracks.map(tracks => {
                return <Track key= {tracks.track_id} tracks = {tracks}/>
            })
    )
}