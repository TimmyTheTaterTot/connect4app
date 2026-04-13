import React from 'react';

import { useNavigate } from 'react-router-dom';

export function Leaderboard() {
    const navigate = useNavigate();

    const [scores, setScores] = React.useState([]);

    // Check if player is logged in and if not, redirect to login page
    React.useEffect(() => {(async () => {
        const res = await fetch('/api/auth', {
            method: 'GET',
        });

        if (!res.ok) navigate('/');
    })()}, []);

    // Load data from DB
    React.useEffect(() => {(async () => {
        const res = await fetch('/api/matches', {
            method: 'GET',
        });
        setScores(await res.json())
    })()}, []);

    const scoresList = [];
    if (scores.length > 0) {
        for (const [i, player] of scores.entries()) {
            scoresList.push(
                <tr key={i}>
                    <td>{i}</td>
                    <td>{player.name}</td>
                    <td>Coming Soon...</td>
                    <td>{player.wins}</td>
                    <td>{player.losses}</td>
                    <td>{((player.wins/player.games)*100).toString().slice(0, 5)}%</td>
                </tr>
            );
        }
    } else {
        scoresList.push(
            <tr key='0' className="text-center">
                <td colSpan='6'>No rankings yet! Please come back after playing...</td>
            </tr>
        );
    }

    return (
        <main>
            <table className="table table-dark table-striped table-hover">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>ELO</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Win Rate</th>
                    </tr>
                </thead>
                <tbody>
                    { scoresList }
                </tbody>
            </table>
        </main>
    );
}