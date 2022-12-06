import React, {useState, useRef} from "react";
import IDSearch from "../modules/idSearch";


export default function CreateList (){
    const login = localStorage.getItem("isLoggedIn");
    const [serverStatus, setServerStatus] = useState("")
    

    const listNameRef = useRef()
    const listDescriptionRef = useRef()
    const tracksListRef = useRef()

    async function CreateList(e) {
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
        {!login ?  <>
        <h2>You must be logged in to create a list!!</h2>
        </>
        : null}
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
        <div>{serverStatus}</div>
        <IDSearch/>
        </>
        : null}
        </>
    )
}