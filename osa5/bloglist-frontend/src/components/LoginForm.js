import React from 'react'


const LoginForm = (props) => {


    return (

        <div>
            <h2>Login</h2>
            <form onSubmit={props.loginHandler}>
                <div>
                username
                    <input
                        type="text"
                        value={props.username}
                        name="Username"
                        onChange={props.usernameHandler}
                    />
                </div>
                <div>
                password
                    <input
                        type="password"
                        value={props.password}
                        name="Password"
                        onChange={props.passwordHandler}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm