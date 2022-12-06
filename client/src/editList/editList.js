import React, { useState, useEffect } from 'react';
import ListProcessor from '../modules/listProcessor';
import IDSearch from '../modules/idSearch';


export default function EditList() {
  //get login state
  const login = localStorage.getItem("isLoggedIn");
  //list state
  const [lists, setLists] = useState([])

  //populate the user's lists as soon as page loads
  useEffect(() => {
    let ignore = false;

    if (!ignore) getLists()
    return () => { ignore = true; }
  }, []);

  //api call for getting lists created by the user
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
      {/* This content is shown if the user isn't logged in  */}
      {!login ? <>
        <h2>You must be logged in to edit your lists</h2>
      </>
        : null}
      {/* This content is shown if the user is logged in  */}
      {login ? <>
        <IDSearch />
        <div>
          <h2>Your Lists</h2>
          <button onClick={getLists}>Refresh</button>
          <hr />
          <ListProcessor lists={lists} />
        </div>
      </>
        : null}
    </>
  )
}