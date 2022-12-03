import React, { useRef, useEffect } from "react"

export default function Register() {
    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    async function registerUser(e) {
        const username = usernameRef.current.value
        const email = usernameRef.current.value
        const password = usernameRef.current.value
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
                    console.log(data.errors)
                    console.log(data.errors[0].msg)
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
                <h3>Sign Up</h3>
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
            </div>
        </div>
    )
}