import React from 'react'
import List from './list'

export default function ViewLists ({lists}){
    //return a list element for each list
    return(
            lists.map(list => {
                return <List key= {list._id} list = {list}/>
            })
    )
}