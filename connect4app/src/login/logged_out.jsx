import React from 'react';

export function LoggedOut({ onLogin }) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState(null);

    const buttonsDisabled = !username.trim() || !password;

    async function login() {
        localStorage.setItem('username', username);
        const res = await fetch('/api/auth', {
            method: 'PUT',
            body: JSON.stringify({ username: username, password: password}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
        if (res.ok) {
            onLogin(username);
        } else {
            const error = await res.json();
            setErrorMessage(`Error: ${error.msg}`);
        }
    }

    async function createUser() {
        localStorage.setItem('username', username);
        const res = await fetch('/api/auth', {
            method: 'POST',
            body: JSON.stringify({ username: username, password: password}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
        if (res.ok) {
            onLogin(username);
        } else {
            const error = await res.json();
            setErrorMessage(`Error: ${error.msg}`);
        }
    }

    return (
    <div>
        <h1 className="text-light text-nowrap">Connect 4 Club Login</h1>
        <div className="input-group mb-3">
            <span className="input-group-text">Username:</span>
            <input className="form-control" onChange={(e) => setUsername(e.target.value)} type="text" placeholder="example@email.com" />
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">Password:</span>
            <input className="form-control" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
        </div>
        {errorMessage && <div className='mb-2'>
            <span style={{ color: '#FF5A5F' }} className='fw-bold fs-5'>{errorMessage}</span>
        </div>}
        <button className="btn btn-primary mx-auto px-4" onClick={ () => login() } disabled={ buttonsDisabled }>Login</button>
        <button className="btn bg-mid text-white mx-auto px-4" onClick={ () => createUser() } disabled={ buttonsDisabled }>Register</button>
    </div>
    );
}