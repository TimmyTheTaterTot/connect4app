import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

import { Login } from './login/login';
import { Play } from './play/play';
import { Leaderboard } from './leaderboard/leaderboard';
import { About } from './about/about';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <BrowserRouter>
        <div className="body bg-dark text-light">
            <header className="container-fluid d-flex flex-wrap justify-content-center py-3">
                <NavLink to="/" className="d-flex align-items-center me-3 me-md-auto link-body-emphasis text-decoration-none"> 
                    <img src="favicon.ico" className="icon" />
                    <span className="text-white fs-4 fw-bold">Connect 4 Club</span> 
                </NavLink> 
                <ul className="nav nav-pills"> 
                    <li className="nav-item">
                        <NavLink to="" className="nav-link" aria-current="page">Login</NavLink>
                    </li> 
                    <li className="nav-item">
                        <NavLink to="play" className="nav-link">Play</NavLink>
                    </li> 
                    <li className="nav-item">
                        <NavLink to="leaderboard" className="nav-link">Leaderboard</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="about" className="nav-link">About</NavLink>
                    </li> 
                </ul> 
            </header>

            <Routes>
                <Route path="/" element={<Login />} exact />
                <Route path="/play" element={<Play />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

            <footer className="py-2">
                <div className="container d-flex justify-content-between align-items-center">
                    <span className="text-white">© 2025 Zack Darling</span>
                    <NavLink to="https://github.com/TimmyTheTaterTot/connect4app" className="text-white" target="_blank" rel="noopener noreferrer">
                    GitHub
                    </NavLink>
                </div>
            </footer>
        </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}