import React from 'react';

import { useNavigate } from 'react-router-dom';


export function LoggedIn({ username, onLogout }) {
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = React.useState(null);

    async function logout() {
        localStorage.removeItem('username');
        const res = await fetch('/api/auth', {
            method: 'DELETE',
        });
        if (res.ok) {
            onLogout();
        } else {
            const error = await res.json();
            setErrorMessage(`Error: ${error.msg}`);
        }
    }

    return (
    <div>
        <h2 className="text-light text-nowrap">Welcome to Connect 4 Club</h2>
        <h1 className="text-light text-nowrap">{ username }</h1>
        {errorMessage && <div className='mb-2'>
            <span style={{ color: '#FF5A5F' }} className='fw-bold fs-5'>{errorMessage}</span>
        </div>}
        <button className="btn btn-primary mx-auto px-4" onClick={ () => navigate('/play') }>Play</button>
        <button className="btn bg-mid text-white mx-auto px-4" onClick={ () => logout() }>Log Out</button>
    </div>
    );
}