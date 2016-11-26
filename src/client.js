var Client = function (id, socket) {
    this.id = id;
    this.lobby;
    this.currentSocketRoom;
    this.clientLocation = "";
    this.clientSocket = socket;

    //gets the status of the lobby
    this.getLobbyStatus = function () {
        return this.lobby.status();
    }

    //gets the clients id
    this.getId = function () {
        return this.id;
        
    }

    //sets a clients instance
    this.setLobby = function (lobby) {
        try {
            if (lobby !== null) {
                this.lobby = lobby;
            } else {
                throw new Error("Unexspected type");
            }
        } catch (e) {
            console.log(e);
        }
    }

    //resets the lobby number to default 0 - not in lobby
    this.resetLobby = function () {
        this.lobby = null;
    }

    //sets the location of the client within the game, menu and lobbies
    this.setLocation = function (newLoc) {
        this.clientLocation = newLoc;
        console.log("Srv : Client " + this.id + " Location updated");
    }

    //creates a new lobby instance
    this.createLobby = function (id, playerID) {

    }

    //handshake method for testing code reachability
    this.handshakeClient = function () {
        console.log("Svr -> Client: " + this.id + " Is reachable");
    }

    //gets the user lobby assigned to the client
    this.getUserLobby = function () {
        return this.lobby;
    }

    //gets the lobbys number
    this.getLobbyNum = function () {
        return this.lobby.getLobbyID();
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