import React, { useState, useRef } from 'react';


export default function Admin (){
    const admin = localStorage.getItem("isAdmin");
    const userNameRef = useRef()

    return(
        <>
        {admin ? <>
            <h2>Make User Admin</h2>
            <br/>
            <input ref={userNameRef} type="text" placeholder="Enter User Email..."/>
            <input type="button" defaultValue="Give Admin Rights"/>
            <br/>
        </> :null}

        </>
    )
}