var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Client = require('./src/Client.js');

//Gets all of the connected clients
var allConnectedClients = new Map();

app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(80);

io.on('connection', function (socket) {
    //when a new user connects assign and log all client id's
    var connectedUser = new Client(socket.id);

    allConnectedClients.set(socket.id, connectedUser);

    socket.emit('onconnected', {
        id: socket.id,
        canvasType : "menu"
    });

    console.log("New Client connected: " + socket.id);

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

    socket.on('clientLoaded', function (data) {
        connectedUser.setLocation("front Menu");
        console.log("client: " + data.id + " loaded onto home screen");
    });

    //joins a client to a room and assigns the lobby id
    socket.on('joinRoom', function () {
        console.log("tried to join a room");
    });

    //creates a lobby and joins the client to the lobby.
    socket.on('createRoom', function () {

    });
});

