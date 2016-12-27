var Game = function (id, playerID) {

    //game properties
    this.lobbyID = id;
    this.lobbyStatus = "InLobby";
    this.host = playerID;

    //when a new lobby is formed 
    this.player1ID = playerID;
    this.player2ID = "";

    //spaceships
    this.player1Spaceship;
    this.player2Spaceship;

    //player status within game
    this.player1Status = false;
    this.player2Status = false;

    //gets the LobbyID
    this.getLobbyID = function () {
        return this.lobbyID;
    }

    //gets player 1's ID
    this.getPlayer1ID = function () {
        return this.player1ID;
    }

    //sets player 2's ID
    this.setPlayer2 = function (playerID) {
        this.player2ID = playerID;
    }

    //gets player 2's ID
    this.getPlayer2ID = function () {
        return this.player2ID;
    }

    //sets the instance of spaceship to the game
    this.createPlayerSpaceship = function (spaceshipP1, spaceshipP2) {
        this.player1Spaceship = spaceshipP1;
        this.player2Spaceship = spaceshipP2;
    }

    //finds if a second player is connected
    this.checkPlayer2 = function () {
        if (this.player2ID === null || this.player2ID === "") {
            return 1;
        } else {
            return 2;
        }
    }

    //sets the lobby status
    this.setLobbyStatus = function (status) {
        this.lobbyStatus = status;
    }

    //gets the lobby status
    this.getLobbyStatus = function () {
        return this.lobbyStatus;
    }

    //sets a players status within the lobby
    this.setPlayerStatus = function (playerID) {
        if (playerID === this.player1ID) {
            this.player1Status = this.player1Status ? false : true;
            logPlayerStatus(playerID, this.player1Status ? "Set status to ready" : "Set status to not ready", this.lobbyID);
        } else if (playerID === this.player2ID) {
            this.player2Status = this.player2Status ? false : true;
            logPlayerStatus(playerID, this.player2Status ? "Set status to ready" : "Set status to not ready", this.lobbyID);
        } else {
            console.log("When setting a player status there ID was not found.");
        }


    }

    //Gives report of activity in game when using ternary above.
    function logPlayerStatus(playerID, status, lobbyID) {
        console.log(playerID + " In lobby " + lobbyID + " " + status);
    }

    //gets the players status in the lobby based off playerID
    this.getPlayerStatus = function (playerID) {
        if (playerID === this.player1ID) {
            return this.player1Status;
        } else {
            return this.player2Status;
        }
    }

    //gets the status of both players
    this.getPlayerReadStatus = function () {
        return this.player1Status && this.player2Status ? true : false;
    }

}

module.exports = Game;
