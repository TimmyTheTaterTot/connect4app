# CS 260 Connect 4 Game

## Deliverable Write-ups

### Startup Spec

##### Elevator Pitch
My application wll be a fun and interactive online app where anyone can play connect 4 against another random player in free play or against their friends in custom games. It will include a simple, easy to use interface, and a scoreboard where you can see each player's record of wins and losses.

##### Key Features
- Interactive game board
- Login and account management with game history (win/loss/against whom)
- Leaderboard based on either wins and losses or an ELO system
- Simple and interactive single-page interface

##### Represent all Technologies
**HTML:** I will use HTML to outline and structure my website, with a page for login, play, leaderboards/profiles, and general site information.\
**CSS:** Scalable site, especially when it comes to making the play screen still look good on different screen aspect ratios.\
**React:** Enhance visuals for the play, and make many aspects of the site (login and other endpoint calls) operative. Also used to create a single page application rather than multiple HTML pages.\
**Service:** Backend service with endpoints for: Making player moves, setting and retrieving leaderboard and profile data, registering and logging in users.\
**DB:** Store game history and user profiles with their associated game details.\
**WebSocket:** Transfer information about currently active games (player moves, potentially game chat) so the game can update in real time.