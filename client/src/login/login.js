import React, { useRef, useState } from "react"

export default function Login (props) {
    const [serverStatus, setServerStatus] = useState([])
    const listItems = serverStatus.map((error) => 
                <li>{error}</li>)

    const emailRef = useRef()
    const passwordRef = useRef()

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
                    if (typeof data.errors[0].msg === 'string'){
                        setServerStatus([data.errors[0].msg])
                    }else{
                        setServerStatus(data.errors[0].msg)
                    }
                } else {
                    localStorage.setItem("x-auth-token", data.token);
                    localStorage.setItem("isLoggedIn", true);
                    window.location = "/"
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
                    <input ref = {emailRef}
                        type="email"
                        placeholder="Enter email"
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input ref = {passwordRef}
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
                <ul>
                    {listItems}
                </ul>
            </div>
        </div>
    )
}

