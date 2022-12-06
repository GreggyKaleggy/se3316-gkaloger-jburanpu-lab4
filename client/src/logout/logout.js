import React from "react";


export default function Logout (){
    //logout the user by clearing the login data
    function logoutUser() {
        localStorage.clear();
        window.location = "/"
    }
    return(
        <>
        <h1>Are you sure you want to log out?</h1>
        <button onClick = {logoutUser}>Yes</button>
        </>
    )
}