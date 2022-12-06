import React, {useState, useRef} from "react";
import IDSearch from "../modules/idSearch";
import ErrorDisplay from "../modules/errorDisplay";


export default function CreateList (){
    //get login state
    const login = localStorage.getItem("isLoggedIn");
    //server state for error handling
    const [serverStatus, setServerStatus] = useState([])
    
    //refs
    const listNameRef = useRef()
    const listDescriptionRef = useRef()
    const tracksListRef = useRef()

    //call for creating a list using a name, track IDs, and optional description
    async function CreateList(e) {
        //get current inputed values
        const name = listNameRef.current.value
        const desc = listDescriptionRef.current.value
        const track_ids = tracksListRef.current.value
    
        setServerStatus("Loading...")
        fetch('/api/lists/new', {
          method: 'POST',
          headers: {
            'Accept': '/',
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('x-auth-token')
          },
          body: JSON.stringify({
            name: name,
            desc: desc,
            track_ids: track_ids
          })
        }).then(response =>
          response.json())
          .then(data => {
            if (data.errors) {
              setServerStatus(`Error: ${data.errors[0].msg}`)
            } else {
              setServerStatus(`List created with name: ${data.name}`)
            }
          }
          )
      }

    return(
        <>
        {/* This content is shown if the user isn't logged in  */}
        {!login ?  <>
        <h2>You must be logged in to create a list!!</h2>
        </>
        : null}
        {/* This conent is shown if the user is logged in */}
        {login ?  <>
        <h2>Create a List!</h2>
        <hr/>
        <input ref={listNameRef} type="text" placeholder="List Name"/>
        <br/>
        <input ref={listDescriptionRef} type="text" placeholder="Description (Optional)"/>
        <br/>
        <input ref={tracksListRef} type="text" placeholder="Tracks"/>
        <br/>
        <input onClick={CreateList} type="button" defaultValue="Submit"/>
        <ErrorDisplay errors={serverStatus}/>
        <IDSearch/>
        </>
        : null}
        </>
    )
}