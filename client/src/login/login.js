import React, { useRef, useState } from "react"
import ErrorDisplay from "../modules/errorDisplay"

export default function Login(props) {
    //states for the server status and user email verification
    const [serverStatus, setServerStatus] = useState([])
    const [verify, setVerify] = useState("")

    //input refs
    const emailRef = useRef()
    const passwordRef = useRef()
    
    //hookup for opening the verify email link with a button
    function verifyEmail(){
        window.open(verify, "_Blank")
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
                <ErrorDisplay errors={serverStatus} />
                {verify !== "" ? <>
                <div>Please Verify your email here:</div>
                <button onClick = {verifyEmail}> Verify </button>
                </> : null}
            </div>
        </div>
    )
}

