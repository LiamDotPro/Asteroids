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
        try {
            if (allConnectedClients.has(socket.id)) {
                allConnectedClients.delete(socket.id);
                console.log('user disconnected');
                console.log(allConnectedClients);
            } else {
                throw new Error("No socket id found in client list.");
            }
        }
        catch (e) {
            console.log(e);
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

        console.log(connectedUser);
    });

    //creates a lobby and joins the client to the lobby.
    socket.on('createLobby', function () {
        console.log("Srv <- Client created a lobby");

        //Generate new UUID
        UUID.generateUUID();

        //create a new lobby with game instance
        clientInstance.setLobby(new Game(UUID.getUUID(), socket.id));
        console.log(clientInstance.getUserLobby());

        //sets a room up for the users game
        socket.join(clientInstance.getLobbyNum());

        //notify all clients of lobby creation
        io.emit('lobbyCreated', {
            lobbyID: clientInstance.getLobbyNum()
        });

        socket.emit('userJoinedLobby', {
            lobbyID: clientInstance.getLobbyNum()
        });
    });

    //player has tried to join a lobby
    socket.on('joinLobby', function (data) {
        allConnectedClients.forEach(function (element) {
            if (element.getUserLobby() !== null) {
                if (element.getLobbyNum() === data.lobbyID) {

                    //adds a user to the lobby and sets them as player 2
                    element.getUserLobby().setPlayer2(clientInstance.getId());

                    //joins the user to the room
                    socket.join(element.getLobbyNum());

                    socket.emit('userJoinedLobby', {
                        lobbyID: element.getLobbyNum()
                    });
                }
            }
        })
    });
});
