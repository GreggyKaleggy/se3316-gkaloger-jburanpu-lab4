import React from "react"

export default function Login (props) {
    return (
        <div>
            <form>
                <div>
                    <h3>Sign In</h3>
                    <div>
                        <label>Email address</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                        />
                    </div>
                    <div>
                        <button>
                            Submit
                        </button>
                    </div>
                    <p>
                        Don't have an account? <a href="/register">Register</a> today!
                    </p>
                </div>
            </form>
        </div>
    )
}

