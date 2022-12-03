import React from 'react'
import Track from './track'

export default function trackList ({tracks}){
    return(
            tracks.map(tracks => {
                return <Track key= {tracks.track_id} tracks = {tracks}/>
            })
    )
}