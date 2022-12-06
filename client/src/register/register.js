import React, { useRef, useState } from "react"
import ErrorDisplay from "../modules/errorDisplay"

export default function Register() {
    const [serverStatus, setServerStatus] = useState([])
    const [verify, setVerify] = useState("")

    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

    function verifyEmail(){
        window.open(verify, "_Blank")
    }

    async function registerUser(e) {
        const username = usernameRef.current.value
        const email = emailRef.current.value
        const password = passwordRef.current.value
        
        setServerStatus([])
        setVerify("")

        fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Accept': '/',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        }).then(response =>
            response.json())
            .then(data => {
                if (data.errors) {
                    setServerStatus(data.errors[0].msg)
                } else if (data.verify) {
                    setVerify(data.verify[0].msg)
                } else {
                    localStorage.setItem("x-auth-token", data.token);
                    localStorage.setItem("isLoggedIn", true);
                    window.location = "/"
                }
            }
            )
    }
    return (
        <div >
            <div >
                <h3>Register Account</h3>
                <div>
                    <label>Username</label>
                    <input ref={usernameRef}
                        type="username"
                        placeholder="Username"
                    />
                </div>
                <div>
                    <label>Email address</label>
                    <input ref={emailRef}
                        type="email"
                        placeholder="Email Address"
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input ref={passwordRef}
                        type="password"
                        placeholder="Password"
                    />
                </div>
                <div>
                    <button onClick={registerUser}>
                        Submit
                    </button>
                </div>
                <p>
                    Already have an account? <a href="/login">Log in</a>
                </p>
                <ErrorDisplay errors = {serverStatus}/>
                {verify !== "" ? <>
                <div>Please Verify your email here:</div>
                <button onClick = {verifyEmail}> Verify </button>
                </> : null}
            </div>
        </div>
    )
}