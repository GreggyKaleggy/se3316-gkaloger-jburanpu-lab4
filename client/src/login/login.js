import React, { useRef, useState } from "react"
import ErrorDisplay from "../modules/errorDisplay"

export default function Login(props) {
    const [serverStatus, setServerStatus] = useState([])
    const [verify, setVerify] = useState("")

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
                    setServerStatus(data.errors[0].msg)
                } else if (data.verify) {
                    setVerify(data.verify[0].msg)
                } else {
                    localStorage.setItem("x-auth-token", data.token);
                    localStorage.setItem("isLoggedIn", true);
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
                {verify !== "" ? <><div>{verify}</div></> : null}
            </div>
        </div>
    )
}

