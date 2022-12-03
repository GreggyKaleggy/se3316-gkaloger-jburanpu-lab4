import React from 'react'
import List from './list'

export default function PublicLists ({lists}){
    return(
            lists.map(list => {
                return <List key= {lists._id} list = {list}/>
            })
    )
}