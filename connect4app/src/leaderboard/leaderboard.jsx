import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Leaderboard({ loginState, authLoading }) {
    const navigate = useNavigate();

    const [scores, setScores] = React.useState([]);

    // Check if player is logged in and if not, redirect to login page
    React.useEffect(() => {
        if (loginState === null || loginState === true) return;
        navigate('/');
    }, [loginState]);

    // Load cached data then update from DB
    React.useEffect(() => {(async () => {
        const lbCache = localStorage.getItem('lbCache');
        if (lbCache) {
            setScores(JSON.parse(lbCache));
        };

        const res = await fetch('/api/matches', {
            method: 'GET',
        });
        const lbUpdated = await res.json();
        setScores(lbUpdated);
        localStorage.setItem('lbCache', JSON.stringify(lbUpdated));
    })()}, []);

    const scoresList = React.useMemo(() => {
        const lbList = [];
        if (scores.length > 0) {
            for (const [i, player] of scores.entries()) {
                lbList.push(
                    <tr key={i}>
                        <td>{i}</td>
                        <td>{player.username}</td>
                        <td>Coming Soon...</td>
                        <td>{player.wins}</td>
                        <td>{player.losses}</td>
                        <td>{(player.winrate*100).toString().slice(0, 5)}%</td>
                    </tr>
                );
            }
        } else {
            lbList.push(
                <tr key='0' className="text-center">
                    <td colSpan='6'>No rankings yet! Please come back after playing...</td>
                </tr>
            );
        }
        return lbList;
    }, [scores]);

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