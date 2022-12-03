import React from 'react'
import List from './list'

export default function ViewLists ({lists}){
    return(
            lists.map(list => {
                return <List key= {list._id} list = {list}/>
            })
    )
}