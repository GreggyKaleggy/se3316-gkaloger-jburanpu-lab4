import React, { useState, useEffect } from 'react';
import ViewLists from '../modules/viewLists';


export default function MyLists (){
    const login = localStorage.getItem("isLoggedIn");
    const [lists, setLists] = useState([])

    useEffect(() => {
        let ignore = false;
    
        if (!ignore) getLists()
        return () => { ignore = true; }
      }, []);
    
      async function getLists(e) {
        fetch('/api/lists/mylists', {
            method: 'GET',
            headers: {
              'Accept': '/',
              'Content-Type': 'application/json',
              'x-auth-token': localStorage.getItem('x-auth-token')
            }
          })
          .then(response => response.json())
          .then(data =>
            setLists(data))
      }
    return(
        <>
        {!login ?  <>
        <h2>You must be logged in to view your lists</h2>
        </>
        : null}
        {login ?  <>
        <div>
        <h2>Your Lists</h2>
        <button onClick={getLists}>Refresh</button>
        <hr />
        <ViewLists lists={lists} />
        </div>
        </>
        : null}
        </>
    )
}