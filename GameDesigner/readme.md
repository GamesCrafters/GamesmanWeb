# Board Game Prototyper/Creator (with Working Live Multiplayer) <!-- omit in toc -->

Created by Abhijay Bhatnagar
(Fall 2018)


# Table of Contents  <!-- omit in toc -->
- [Project Description / Vision](#project-description--vision)
- [Technical Architecture](#technical-architecture)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Deployment](#deployment)
  - [Requirements](#requirements)
  - [Instructions](#instructions)
- [Future Considerations](#future-considerations)

## Project Description / Vision

The goal of this project was to create a tool that allowed for easy creation of playable custom board games. Intended to assist future sessions of gamescrafters, this tool allows to customize the size and dimensions of the board, the individual pieces, and the initial layout of the game. Designed in the spirit of putting a physical board online, giving as much freedom to the players as possible. Additionally, once a game is created, the tool supports live multiplayer, allowing you to test and play your game with others.

Currently, the project supports the following features:
- Create rectangular boards up to 10x10 tiles in dimension (abitrary constraint, can be increased).
- Support for 46 distinct game pieces, including original 12 chess pieces as well as 34 custom pieces.
- Customization of game title
- Support for saving created game layout for future use
- Support for sharing game session for live multiplayer

## Technical Architecture

This tool comes in the form of a deployable website.

### Backend

The backend of the tool is comprised NodeJS and ExpressJS for the server handling and serving, and [Socket.io](https://socket.io) for the live event notification handling necessary for multiplayer.

The 'game' is an abstracted javascript object that has pieces and layouts. This object is passed around each page to load the data, and is stored on the server end with a unique game ID to keep track of player moves.

Sockets.io serves as an event listener synced between different machines, allowing us to alert the other player of move updates.

All players are assigned unique player IDs, kept track on the server.

### Frontend

The front end for the website comprises of HTML templating through [HandleBars](https://handlebarsjs.com/) combined with custom CSS and a minimal amount of [Bootstrap](https://getbootstrap.com/).

The tool currently is split between 3 main pages:

1. "Create New Game"

Here you create a new instance of a game and input all of its meta-data. Additionally, you select the dimensions of the board.

This is where the game object is initially created.

Template: `builder.hbs`
Script: `/public/scripts/builder.js`

2. "Design Board"

Here, the board GUI element is initially introduced. This is a rather complex bit of javascript/html/css that allows us to mutate the board grid based off of drag and drop actions.

Template: `pieces.hbs`
Script: `/public/scripts/pieces.js`

3. "Play Game"

Here, the board GUI element is once again used, with an additional dynamically created shareable link being displayed in a pop up menu.

Template: `game.hbs`
Script: `/public/scripts/game.js`

## Deployment

### Requirements
To use this tool, you will need:
1. [NodeJS](https://nodejs.org/en/)
2. [Yarn](https://yarnpkg.com/en/)
3. [Ngrok](https://ngrok.com/) (Optional)

### Instructions

First, you will need to download this repository onto your machine.

Afterwards, navigate to the repository in a CLI of your choice (e.g. Terminal in MacOSX, GitBash in Windows)

Then install all the dependencies through the following command:
```
yarn
```

After that completes, run the node server with:
```
node app.js
```

The game should now be accessible on localhost through the port displayed in the CLI (defaults to http://localhost:3000/). (*Note: This should redirect you to the http://localhost:3000/builder page.*)

Now you can run through the tool and create your board game, and you can share it to others with the "Get Shareable Link" button on the final page.

(Optional)
Additionally, if you would like to share the game to others not in your local wifi network, you can do so with [Ngrok](https://ngrok.com/). In a separate CLI window, run the following command:
```
ngrok http 3000
```
(Replace `3000` with another port if the node server is not running on that port.)

Now, anyone anywhere can access your game live through the ngrok link displayed on the CLI.

## Future Considerations

In the future, the following features are being considered:
- Non-rectangular game modes
- Custom piece "capture" actions
- Restriction of piece movement
- Implementation of computer AI
