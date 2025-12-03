import React from 'react';

export function Leaderboard() {
    const [scores, setScores] = React.useState([]);

    // Load data from DB
    React.useEffect(() => {
        const highScores = localStorage.getItem('highScores');
        if (highScores) {
            setScores(JSON.parse(highScores));
        }
    }, []);

    const scoresList = [];
    if (scores.length > 0) {
        for (const [i, player] of scores.entries()) {
            scoresList.push(
                <tr>
                    <td>{i}</td>
                    <td>{player.name}</td>
                    <td>{player.elo}</td>
                    <td>{player.wins}</td>
                    <td>{player.losses}</td>
                    <td>{(player.wins/player.gamesPlayed).toString().slice(0, 5)}</td>
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
                        <th>W/L Ratio</th>
                    </tr>
                </thead>
                <tbody>
                    { scoresList }
                </tbody>
            </table>
        </main>
    );
}