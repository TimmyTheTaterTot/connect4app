import React from 'react';

import './login.css'

import { useNavigate } from 'react-router-dom';


export function LoggedIn({ username, onLogout }) {
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = React.useState(null);
    const [quoteBody, setQuoteBody] = React.useState('Loading...');
    const [quoteAuthor, setQuoteAuthor] = React.useState('');

    React.useEffect(() => {(async () => {
        const res = await fetch('https://quote.cs260.click/', {
            method: 'GET'
        })
        if (res.ok) {
            const quote = await res.json();
            console.log(quote);
            setQuoteBody(quote.quote);
            setQuoteAuthor(quote.author);
        }
    })()}, []);

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
            <div className="mt-4 text-white quote-text">{quoteBody}</div>
            {quoteAuthor && 
                <span className="fw-bold text-white">- {quoteAuthor}</span>
            }
        </div>
    );
}