import React, { useRef, useState } from "react"
import ErrorDisplay from "../modules/errorDisplay"

export default function Login(props) {
    //states for the server status, change password, and user email verification
    const [serverStatus, setServerStatus] = useState([])
    const [verify, setVerify] = useState("")
    const [pass, setPass] = useState(false)

    //input refs
    const emailRef = useRef()
    const passwordRef = useRef()
    const passEmailRef = useRef()
    const passOldRef = useRef()
    const passNewRef = useRef()
    
    //hookup for opening the verify email link with a button
    function verifyEmail(){
        window.open(verify, "_Blank")
    }

    //toggle for showing / hiding forgot password
    function changePass(e){
        if (!pass){
            setPass(true)
        } else{
            setPass(false)
        }
    }

    //api call for allowing the user to log in using their username and password
    async function loginUser(e) {
        const email = emailRef.current.value
        const password = passwordRef.current.value

        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Accept': '/',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(response =>
            response.json())
            .then(data => {
                if (data.errors) {
                    setServerStatus(data.errors[0].msg)
                //display a message if the user needs to verify their account
                } else if (data.verify) {
                    setVerify(data.verify[0].msg)
                } else {
                    //if the user logs in successfully, save their token and log-in state
                    localStorage.setItem("x-auth-token", data.token);
                    localStorage.setItem("isLoggedIn", true);
                    //nested API call to get the user's admin status as they log in
                    fetch('/api/admins/admincheck', {
                        method: 'get',
                        headers: {
                            'Accept': '/',
                            'Content-Type': 'application/json',
                            'x-auth-token': localStorage.getItem('x-auth-token')
                        }
                    }).then(response =>
                        response.json())
                        .then(data => {
                            if (data.errors) {
                                console.log("Uh Oh, this shouldn't happen")
                            } else {
                                //store the admin status
                                localStorage.setItem("isAdmin", data.isAdmin)
                                window.location = "/"
                            }
                        }
                        )
                }
            }
            )
    }

    //api call to change the user's password
    async function ChangePass (e){
        const email = passEmailRef.current.value
        const oldPass = passOldRef.current.value
        const newPass = passNewRef.current.value

        fetch('/api/users/changepassword', {
            method: 'PUT',
            headers: {
              'Accept': '/',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email : email,
              oldPassword: oldPass,
              newPassword: newPass
            })
          }).then(response =>
            response.json())
            .then(data => {
              if (data.errors) {
                setServerStatus(data.errors[0].msg)
              } else {
                setServerStatus(`Password Updated!`)
                changePass()
                
              }
            }
            )
      }

    return (
        <div>
            <div>
                <h3>Sign In</h3>
                <div>
                    <label>Email address</label>
                    <input ref={emailRef}
                        type="email"
                        placeholder="Enter email"
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input ref={passwordRef}
                        type="password"
                        placeholder="Enter password"
                    />
                </div>
                <div>
                    <button onClick={loginUser}>
                        Submit
                    </button>
                </div>
                <p>
                    Don't have an account? <a href="/register">Register</a> today!
                </p>
                <div>
                    <button onClick={changePass}>
                        Change Password
                    </button>
                    {pass ? <>
                        <br/>
                        <b>Change Password</b>
                        <br/>
                        <input ref={passEmailRef} type="text" placeholder="Email"/>
                        <br/>
                        <input ref={passOldRef} type="password" placeholder="Old Password"/>
                        <br/>
                        <input ref={passNewRef} type="password" placeholder="New Password"/>
                        <br/>
                        <input type="button" onClick={ChangePass} defaultValue="Change"/>
                        <br/>
                    </> : null}
                </div>
                <ErrorDisplay errors={serverStatus} />
                {/*Display a message and button for the user to verify their account*/}
                {verify !== "" ? <>
                <div>Please Verify your email here:</div>
                <button onClick = {verifyEmail}> Verify </button>
                </> : null}
            </div>
        </div>
    )
}

