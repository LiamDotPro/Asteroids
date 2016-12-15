function player(id, socket) {

    this.lobbyID = 0;
    this.lobbyStatus = false;

    this.location = "Not Loaded";
    this.playerSocket = socket;
    this.playerID = id;

    //gets the players id
    this.getId = function () {
        return this.playerID;
    }

    //gets the location of the user
    this.getLocation = function () {
        return this.location;
    }

    //gets the lobby ID
    this.getLobbyID = function () {
        return this.lobbyID;
    }

    //sets the location of the user
    this.setLocation = function (newLocation) {
        this.location = newLocation;
    }

    //Notifys the server of client location changes
    this.serverClientLocation = function (location) {

        try {
            if (location === null || location === '') {
                throw new Error("Location passed as null or empty string");
            }
        } catch (e) {
            console.log(e);
        } finally {
            this.playerSocket.emit('clientLocationChange', {
                stage: location
            });

            this.location = location;

            console.log("Client -> Server: updated clients location.")
        }
    }

    //tells the server a user is attempting to create a new lobby
    this.playerCreateALobby = function () {
        this.playerSocket.emit('createLobby', {});
    }

    //attempts to join a player to a lobby instance
    this.joinALobby = function (lobbyID) {
        console.log("I'm Attempting to join a lobby!");
        this.playerSocket.emit('joinLobby', {
            lobbyID: lobbyID
        })
    }

    //registers from the server the player has joined a lobby
    this.joinedLobby = function (lobbyNum) {
        this.lobbyID = lobbyNum;
        this.lobbyStatus = true;
        console.log("Joined lobby: " + lobbyNum);
    }

    //tells the srv that the player has left the lobby
    this.playerLeaveLobby = function () {
        this.playerSocket.emit('leaveLobby', {});
    }
}