// This class holds all of the information that the server needs to know about the connected client
var Client = function (id, socket) {
    this.id = id;
    this.lobbyStatus = false;
    this.lobbyNum = 0;
    this.currentSocketRoom;
    this.clientLocation = "";
    this.clientSocket = socket;

    //gets the status of the lobby
    this.getLobbyStatus = function () {
        if (typeof this.lobby === 'undefined' || !this.lobby) {
            return "not Set";
        } else {
            return this.lobby.getStatus();
        }
    }

    //gets the clients id
    this.getId = function () {
        return this.id;

    }

    //sets the location of the client within the game, menu and lobbies
    this.setLocation = function (newLoc) {
        this.clientLocation = newLoc;
        console.log("Srv <- Client " + this.id + " Location updated");
    }

    //handshake method for testing code reachability
    this.handshakeClient = function () {
        console.log("Svr -> Client: " + this.id + " Is reachable");
    }

    //set the lobby number if connected
    this.setLobbyNum = function (newNum) {
        this.lobbyNum = newNum;
    }

    //gets the lobbys number
    this.getLobbyNum = function () {
        return this.lobbyNum;
    }

    //sets the clients socket room
    this.setClientRoom = function (roomName) {
        this.currentSocketRoom = roomName;
    }

    //gets the clients socket room
    this.getClientRoom = function () {
        return this.currentSocketRoom;
    }

    //gets the clients socket
    this.getClientSocket = function () {
        return this.clientSocket
    }

}

module.exports = Client;