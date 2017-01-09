var os = require('os');
var R = require('ramda');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//loading server side modules
var Client = require('./src/Client.js');
var Game = require('./src/Game.js');
var Spaceship = require('./src/Spaceship.js');
var Asteroid = require('./src/Asteroid.js');
var UUID = require('./src/UUID.js');

//Gets all of the connected clients
var allConnectedClients = new Map();
var lobbys = new Map();

//UUID generating class
var UUID = new UUID();

app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(80, () => {
    // Log available hosts for the server, based on external addresses.
    'use strict';

    const isInternal = address => address.internal
    const isIpv4 = address => address.family === 'IPv4'
    const isExternalIpv4 = R.both(R.complement(isInternal), isIpv4)

    const urls = networkInterfaces => R.pipe(
      R.props(R.keys(networkInterfaces)),
      R.flatten(),
      R.filter(isExternalIpv4),
      R.map(R.prop('address')),
      R.concat(['127.0.0.1', os.hostname()]),
      R.map(address => `http://${address}`),
      R.join(', ')
    )(networkInterfaces);

    console.log(`Server available at: ${urls(os.networkInterfaces())}.`)
});

io.on('connection', function (socket) {
    //when a new user connects assign and log all client id's
    var connectedUser = new Client(socket.id, socket);
    allConnectedClients.set(socket.id, connectedUser);

    //local variable of client instance inside map
    var clientInstance = allConnectedClients.get(socket.id);

    //tells the canvas to be loaded -> It's at this point that you could build more
    //actual checks about users if needed.
    socket.emit('onconnected', {
        id: socket.id,
        canvasType: "menu"
    });


    console.log("Srv <- Client connected: " + socket.id);

    socket.on('disconnect', function () {

        //Check to see if the disconnecting user was in a lobby.
        if (clientInstance.getLobbyNum() !== 0 && typeof clientInstance.getLobbyNum() != "undefined") {
            console.log(lobbys);
            var CurrentlyConnectedlobby = lobbys.get(clientInstance.getLobbyNum());
            console.log("player Instance " + clientInstance.getLobbyNum());
            console.log(clientInstance);
            console.log(CurrentlyConnectedlobby);
            //check if disconnecting user was host.
            if (CurrentlyConnectedlobby.getPlayer1ID() === clientInstance.getId()) {

                if (CurrentlyConnectedlobby.getPlayer2ID() != "") {

                    console.log(CurrentlyConnectedlobby.getPlayer2ID());

                    //another player is connected to the lobby
                    io.to(CurrentlyConnectedlobby.getPlayer2ID()).emit("HostClosedLobby", {

                    });

                    //set the second players lobby number as 0 as lobby is closed.
                    var secondPlayer = allConnectedClients.get(CurrentlyConnectedlobby.getPlayer2ID());
                    secondPlayer.setLobbyNum(0);
                }


                //notify clients that lobby has been removed - host.
                io.emit('removeLobby', {
                    lobbyID: CurrentlyConnectedlobby.getLobbyID()
                });

                console.log("Srv -> Client Lobby " + CurrentlyConnectedlobby.getLobbyID() + " Has been Removed");

                //safely destroy instance from map.
                lobbys.delete(CurrentlyConnectedlobby.getLobbyID());

            } else {

                console.log(CurrentlyConnectedlobby.getLobbyID());

                //notifys lobby the player has left - not host.
                io.to(CurrentlyConnectedlobby.getLobbyID()).emit("playerLeftLobby", {
                    playerID: clientInstance.getId()
                });

                //Player two from a lobby has left, notify all clients and update lobby board
                io.emit('updateLobbyPlayers', {
                    lobbyID: CurrentlyConnectedlobby.getLobbyID(),
                    players: 1
                });

                //Setting player 2 ID as nothing to repsent not connected.
                CurrentlyConnectedlobby.setPlayer2("");
                console.log("Srv -> Client Player 2 Has left " + CurrentlyConnectedlobby.getLobbyID());
            }
        }

        //Removes the user safely from the map.
        try {
            if (allConnectedClients.has(socket.id)) {
                console.log(socket.id + ' disconnected');
                allConnectedClients.delete(socket.id);

            } else {
                throw new Error("No socket id found in client list.");
            }
        }
        catch (e) {
            console.log(e);
            console.log(allConnectedClients);
        }
    });

    //Handshake to verify client has loaded all assets for homescreen
    socket.on('clientLocationChange', function (data) {

        switch (data.stage) {
            case 'home screen':
                clientInstance.setLocation(data.stage);
                break;
            case 'lobby menu':
                clientInstance.setLocation(data.stage);
                break;
            case 'game lobby':
                clientInstance.setLocation(data.stage);
                break;
            case 'ingame':
                clientInstance.setLocation(data.stage);
                break;
            case 'score screen':
                clientInstance.setLocation(data.stage);
                break;
            default:
                console.log("Invalid location passed");
                break;
        }

    });

    //creates a lobby and joins the client to the lobby.
    socket.on('createLobby', function () {
        console.log("Srv <- Client created a lobby");

        //Generate new UUID
        UUID.generateUUID();

        //create a new lobby with game instance
        lobbys.set(UUID.getUUID(), new Game(UUID.getUUID(), socket.id));
        clientInstance.setLobbyNum(UUID.getUUID());

        console.log("client joined " + clientInstance.getLobbyNum());

        //sets a room up for the users game
        socket.join(clientInstance.getLobbyNum());

        //notify all clients of lobby creation
        io.emit('lobbyCreated', {
            lobbyID: clientInstance.getLobbyNum(),
            players: 1
        });

        socket.emit('userJoinedLobby', {
            lobbyID: clientInstance.getLobbyNum(),
            //only emit this clients id as it's a newly defined lobby
            players: [clientInstance.getId()],
            type: 'host'
        });
    });

    //player has tried to join a lobby
    socket.on('joinLobby', function (data) {
        console.log(connectedUser.getId() + " is attempting to join a lobby");
        console.log(lobbys.get(data.lobbyID) + " " + data.lobbyID);
        var selLobby;

        if (lobbys.get(data.lobbyID) != null) {
            selLobby = lobbys.get(data.lobbyID);
        } else {
            console.log("Srv !-> Client " + socket.id + " Tried to join a lobby but it was not found");
            return;
        }

        //delimiter for the amount of players joined
        if (selLobby.checkPlayer2() === 2) {
            socket.emit('lobbyFull', {
            });
            return;
        }

        //adds a user to the lobby and sets them as player 2
        selLobby.setPlayer2(clientInstance.getId());

        //joins the user to the room
        socket.join(selLobby.getLobbyID());

        //Add lobby number to client
        clientInstance.setLobbyNum(UUID.getUUID());

        //notify others in the lobby you've joined.
        socket.broadcast.to(selLobby.getLobbyID()).emit("UserJoinedYourLobby", {
            playerID: clientInstance.getId()
        });

        //notify 
        socket.emit('userJoinedLobby', {
            lobbyID: selLobby.getLobbyID(),
            players: [selLobby.getPlayer1ID(), clientInstance.getId()],
            p1Status: selLobby.getPlayerStatus(selLobby.getPlayer1ID()),
            type: 'player'
        });

        //updates all of the clients that the lobby number has changed
        io.emit('updateLobbyPlayers', {
            lobbyID: selLobby.getLobbyID(),
            players: 2
        });

    });

    //triggered when a player leaves the home screen
    socket.on('enterClicked', function () {
        console.log("client " + clientInstance.getId() + " Entered the lobby");

        var lobbyArr = [];

        lobbys.forEach(function (element) {
            if (element.getLobbyStatus() === "InLobby") {
                lobbyArr.push([element.getLobbyID(), element.checkPlayer2()]);
            }
        });

        //finds all of the open lobbies currently on the sever
        socket.emit('movedToLobby', {
            arrOfLobbies: lobbyArr
        });

    });

    //triggered when a player in a lobby attempts to ready up
    socket.on('playerAttemptingToReady', function (data) {

        if (!lobbys.has(data.lobbyID)) {
            console.log("Game not found in map when attemping to ready up Lobby Number: " + data.lobbyID);
            console.log(lobbys);
            return;
        }

        var connectedLobby = lobbys.get(data.lobbyID);
        connectedLobby.setPlayerStatus(data.playerID);

        socket.broadcast.to(connectedLobby.getLobbyID()).emit('AnotherPlayerHasReady', {
            playerID: data.playerID,
            playerReadyState: connectedLobby.getPlayerStatus(data.playerID)
        });


    });

    //triggered when a player attempts to start a new game
    socket.on('playerAtemptingToStartGame', function (data) {

        var selectedLobby = lobbys.get(data.lobbyID);

        if (!(selectedLobby.getLobbyStatus() === "InLobby" && selectedLobby.getPlayerReadStatus())) {
            console.log("Both players are not ready or only one player present.");
            socket.emit('failedToStartGame', {

            })
            return;
        }

        console.log("Srv " + data.lobbyID + " game is being started.");

        //create both the spaceships and set initial states.
        var ship1 = new Spaceship(640, 200);
        var ship2 = new Spaceship(640, 400);
        selectedLobby.createPlayerSpaceship(ship1, ship2);

        //set lobby status as playing
        selectedLobby.setLobbyStatus("Playing");

        //create asteroids for game.
        var asteroids = [];

        for (var i = 0; i < 2; i++) {
            asteroids.push(new Asteroid(3, null));
        }

        //notify all clients in lobby game has started and to build game.
        io.to(selectedLobby.getPlayer1ID()).emit('gameStart', {
            you: [640, 200],
            other: [640, 400],
            asteroids: asteroids
        });

        io.to(selectedLobby.getPlayer2ID()).emit('gameStart', {
            you: [640, 400],
            other: [640, 200],
            asteroids: asteroids
        });

        io.emit("gameStartedRemoveLobby", {
            lobbyID: selectedLobby.getLobbyID()
        });


    });

    //triggered when a player in a lobby try to disconnect
    socket.on('playerAttemptingToDisconnect', function (data) {
        console.log("Player attempting to leave via button");
        var CurrentlyConnectedlobby = lobbys.get(clientInstance.getLobbyNum());

        //Check to see if the disconnecting user was in a lobby.
        if (clientInstance.getLobbyNum() !== 0 && typeof clientInstance.getLobbyNum() != "undefined") {

            var CurrentlyConnectedlobby = lobbys.get(clientInstance.getLobbyNum());

            //check if disconnecting user was host.
            if (CurrentlyConnectedlobby.getPlayer1ID() === clientInstance.getId()) {

                if (CurrentlyConnectedlobby.getPlayer2ID() != "") {

                    console.log(CurrentlyConnectedlobby.getPlayer2ID());

                    //another player is connected to the lobby
                    io.to(CurrentlyConnectedlobby.getPlayer2ID()).emit("HostClosedLobby", {

                    });

                    //set the second players lobby number as 0 as lobby is closed.
                    var secondPlayer = allConnectedClients.get(CurrentlyConnectedlobby.getPlayer2ID());
                    secondPlayer.setLobbyNum(0);


                }


                //notify clients that lobby has been removed - host.
                io.emit('removeLobby', {
                    lobbyID: CurrentlyConnectedlobby.getLobbyID()
                });

                console.log("Srv -> Client Lobby " + CurrentlyConnectedlobby.getLobbyID() + " Has been Removed");

                //safely destroy instance from map.
                lobbys.delete(CurrentlyConnectedlobby.getLobbyID());
                //The clients lobby instance is reset
                clientInstance.setLobbyNum(0);

                //change the players state.
                socket.emit('leftLobby', {});
            } else {

                console.log(CurrentlyConnectedlobby.getLobbyID());
                clientInstance.setLobbyNum(0);

                //notifys lobby the player has left - not host.
                io.to(CurrentlyConnectedlobby.getLobbyID()).emit("playerLeftLobby", {
                    playerID: clientInstance.getId()
                });

                //Player two from a lobby has left, notify all clients and update lobby board
                io.emit('updateLobbyPlayers', {
                    lobbyID: CurrentlyConnectedlobby.getLobbyID(),
                    players: 1
                });

                //Setting player 2 ID as nothing to repsent not connected in lobby.
                CurrentlyConnectedlobby.setPlayer2("");

                socket.emit('leftLobby', {});

                console.log("Srv -> Client Player 2 Has left " + CurrentlyConnectedlobby.getLobbyID());
            }
        }
    });

    //triggered when your opponenet moves forward
    socket.on('opponenentMovedForward', function (data) {
        socket.broadcast.to(data.lobbyID).emit("moveOpponenetForward", {});
    });

    //triggered when your opponenet moves left
    socket.on('opponenentMovedLeft', function (data) {
        socket.broadcast.to(data.lobbyID).emit("moveOpponenetLeft", {});
    });

    //triggered when your opponenet moves right
    socket.on('opponenentMovedRight', function (data) {
        socket.broadcast.to(data.lobbyID).emit("moveOpponenetRight", {});
    });

    //triggered when your opponenet shoots
    socket.on('playerShot', function (data) {
        socket.broadcast.to(data.lobbyID).emit("opponentShoot", {});
    });

    //triggered when an asteroid is hit by a player.
    socket.on('asteroidHitByPlayer', function (data) {

        socket.broadcast.to(data.lobbyID).emit("removeBulletAndAsteroid", {
            asteroidID: data.asteroidID,
            bulletID: data.bulletID
        });

        if (data.tier !== 1) {
            var CurrentTier = data.tier - 1;

            var newAsteroids = [];
            for (var i = 0; i < 3; i++) {
                newAsteroids.push(new Asteroid(CurrentTier, data.cords));
            }

            io.to(data.lobbyID).emit('replenishAsteroids', {
                asteroids: newAsteroids
            });
        }


    });

    //triggered when all of the asteroids have been defeated and the level is done.
    socket.on('asteroidsDeafeated', function (data) {
        var lobby = lobbys.get(data.lobbyID);
        if (lobby.getPlayer1ID() === data.player) {
            console.log(data.level);
            var asteroids = [];
            switch (data.level) {
                case 0:
                    for (var x = 0; x < 4; x++) {
                        asteroids.push(new Asteroid(3, null));
                    }
                    break;
                case 1:
                    for (var x = 0; x < 8; x++) {
                        asteroids.push(new Asteroid(3, null));
                    }
                    break;

            }

            console.log(asteroids);

            var newlvl = data.level++;

            io.to(data.lobbyID).emit('replenishAsteroids', {
                asteroids: asteroids
            });

            io.to(data.lobbyID).emit('levelUpdate', {
                level: newlvl
            });

        }
    });

    //triggered when a player is hit by an asteroid
    socket.on('playerHitByAsteroid', function (data) {
        socket.broadcast.to(data.lobbyID).emit("opponentHit", {});
        function sendVunerable() {
            socket.broadcast.to(data.lobbyID).emit("protectionOff", {})
        }
        setTimeout(sendVunerable, 2000);
    });

    socket.on('playerHasLeftScoreScreen', function (data) {
        socket.emit('resetToLobby', {});
    });

    socket.on('gameFinished', function (data) {


        //Making a logical return if the lobby doesn't exsist due to two calls
        if (!lobbys.has(data.lobbyID)) {
            return;
        }

        //If you want to save data do so at this point

        //halts the game loop from outside of the loop itself.
        io.to(data.lobbyID).emit('haltGameLoop', {});

        var selLobby = lobbys.get(data.lobbyID);

        var player1 = allConnectedClients.get(selLobby.getPlayer1ID());
        var player2 = allConnectedClients.get(selLobby.getPlayer2ID());

        player1.setLobbyNum(0);
        player2.setLobbyNum(0);

        lobbys.delete(data.lobbyID);

        //notify clients that lobby has been removed - host.
        io.emit('removeLobby', {
            lobbyID: data.lobbyID
        });

        console.log("Server reached here");

    });
});
