import React from 'react';

import { useNavigate } from 'react-router-dom';


export function LoggedIn({ username, onLogout }) {
    const navigate = useNavigate()

    async function logout() {
        localStorage.removeItem('username');
        onLogout();
    }

    return (
    <div>
        <h2 className="text-light text-nowrap">Welcome to Connect 4 Club</h2>
        <h1 className="text-light text-nowrap">{ username }</h1>
        <button className="btn btn-primary mx-auto px-4" onClick={ () => navigate('/play') }>Play</button>
        <button className="btn bg-mid text-white mx-auto px-4" onClick={ () => logout() }>Log Out</button>
    </div>
    );
}