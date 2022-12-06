import React, { useState, useEffect } from 'react';
import ViewLists from '../modules/viewLists';

export default function MyLists() {
  //get login state
  const login = localStorage.getItem("isLoggedIn");
  //list state
  const [lists, setLists] = useState([])

  //load the user's lists when the page first loads
  useEffect(() => {
    let ignore = false;

    if (!ignore) getLists()
    return () => { ignore = true; }
  }, []);

  //api call to get the user's lists
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
  return (
    <>
      {/*Show a message if the user isn't logged in*/}
      {!login ? <>
        <h2>You must be logged in to view your lists</h2>
      </>
        : null}
      {/*Display lists if the user is logged in*/}
      {login ? <>
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