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

## Assignment Learnings and Notes

### CSS Practice

[CSS Practice Code Pen](https://codepen.io/TimmyTheTaterTot/pen/pvgEeMN)\
From this assignment I was able to learn a lot about styling from scratch with CSS. It really helped me get over a lot of the fear or hesitance that I have felt towards CSS in the past due to how overwhelming it felt with all the declarations and styles to memorize. I learned that if I have a good idea of what I want it to look like in the end, then I can effectively break down the task of creating that outcome into smaller, more manageable pieces, and end up creating the kind of finished product that I was looking for. I was able to liberally use Google to look up the names or usage of different things whenever I needed, so that helped a lot, and I know in the future I will likely use AI a good amount in order to have the best help possible with repetitive or tedious CSS styling.

[Flexbox Practice Code Pen](https://codepen.io/TimmyTheTaterTot/pen/PwZKENo)
From this assignment I learned more about nesting flexboxes and how to get text to align and position how I want it to.

### CSS Deliverable

From this assignment I gained a much greater understanding and level of comfort with using CSS to design and implement reactive, functional, and modern looking features. I am really starting to find a lot of enjoyment with using HTML and CSS to create a website that looks how I want it to look. I also found that I am most comfortable using a mix of Bootstrap and raw CSS to create my webpages, allowing me to benefit from the ease of Bootstrap and also the fine control of regular CSS.

### Vite Introduction

I really enjoyed seeing how the web project comes together so well with build tools such as Vite, running on top of frameworks that change the entire structure and nature of the web applications that they support. It is a whole different way to manage web development, and one that I frankly enjoy a lot more, because it can ideally help me get away from the nitty gritty tediousness that is sometimes present with raw html, css, and js.

### Router Introduction

This assignment actually mainly gave me some hands on experience with debugging my toolchain and with understanding the different features and use cases of Vite and NPM run vs NPX and how they all work together. I have really been able to wrap my head pretty well around React components and how to use them, so I am looking forward to implementing them into my website very soon.