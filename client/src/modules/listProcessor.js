import React from 'react'
import ListEditor from './listEditor'

export default function ListProcessor ({lists}){
    return(
            lists.map(lists => {
                return <ListEditor key= {lists._id} list = {lists}/>
            })
    )
}