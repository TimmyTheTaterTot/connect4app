import React from 'react';

export function Leaderboard() {
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
                <tr>
                    <td>1</td>
                    <td>Zack</td>
                    <td>1100</td>
                    <td>6</td>
                    <td>4</td>
                    <td>0.600</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Jake</td>
                    <td>900</td>
                    <td>8</td>
                    <td>12</td>
                    <td>0.400</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Frank</td>
                    <td>600</td>
                    <td>2</td>
                    <td>14</td>
                    <td>0.125</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Cleo</td>
                    <td>200</td>
                    <td>0</td>
                    <td>16</td>
                    <td>0.000</td>
                </tr>
            </tbody>
        </table>
    </main>
  );
}