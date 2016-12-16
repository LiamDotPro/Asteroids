var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//loading server side modules
var Client = require('./src/Client.js');
var Game = require('./src/Game.js');
var Spaceship = require('./src/Spaceship.js');
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

http.listen(80);

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
            lobbyArr.push([element.getLobbyID(), element.checkPlayer2()]);
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
});