import React from 'react';

export function LoggedOut({ onLogin }) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const buttonsDisabled = !username.trim() || !password;

    async function login() {
        localStorage.setItem('username', username);
        onLogin(username);
    }

    async function createUser() {
        localStorage.setItem('username', username);
        onLogin(username)
    }

    return (
    <div>
        <h1 className="text-light text-nowrap">Connect 4 Club Login</h1>
        <div className="input-group mb-3">
            <span className="input-group-text">Username:</span>
            <input className="form-control" type="text" placeholder="example@email.com" />
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">Password:</span>
            <input className="form-control" type="password" placeholder="password" />
        </div>
        <button className="btn btn-primary mx-auto px-4" onClick={ () => login() } disabled={ buttonsDisabled }>Login</button>
        <button className="btn bg-mid text-white mx-auto px-4" onClick={ () => createUser() } disabled={ buttonsDisabled }>Register</button>
    </div>
    );
}