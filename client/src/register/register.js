import React, { useState } from "react"

export default function (props) {
    return (
        <div >
            <form >
                <div >
                    <h3>Sign Up</h3>
                    <div>
                        <label>Username</label>
                        <input
                            type="username"
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label>Email address</label>
                        <input
                            type="email"
                            placeholder="Email Address"
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div>
                        <button type="submit">
                            Submit
                        </button>
                    </div>
                    <p>
                        Already have an account? <a href="/login">Log in</a>
                    </p>
                </div>
            </form>
        </div>
    )
}