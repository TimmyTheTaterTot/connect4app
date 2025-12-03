import React from 'react';

import "./about.css";

export function About(props) {
  const [tip, setTip] = React.useState("Loading a super helpful tip...");

  // Fetch data
  React.useEffect(() => {
    setTip("The pieces fall straight down, occupying the lowest available space within the column. The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of one's own tokens.")
  }, []);
  
  return (
    <main className="text-center justify-content-center">
        <img className="picture mx-auto" src="https://upload.wikimedia.org/wikipedia/commons/8/84/Connect-four.jpg" />
        <div className="info-box mx-auto bg-mid rounded-4 p-3 pb-1">
            <p>
                Connect 4 is a game in which the players choose a color and then take turns dropping colored tokens into a six-row, seven-column vertically suspended grid. 
            </p>
            <p> { tip } </p>
        </div>
    </main>
  );
}