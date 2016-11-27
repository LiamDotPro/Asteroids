var Game = function (id, playerID, spaceship, spaceship1) {

    //game properties
    this.lobbyID = id;
    this.lobbyStatus;
    this.host = playerID;

    //when a new lobby is formed 
    this.player1ID = playerID;
    this.player2ID;

    //Asteroids

    //spaceships
    this.player1Spaceship = spaceship;
    this.player2Spaceship = spaceship1;

    //player status within game
    this.player1Status = false;
    this.player2Status = false;

    //gets the LobbyID
    this.getLobbyID = function () {
        return this.lobbyID;
    }

    //gets player 1's ID
    this.getPlayer1 = function () {
        return this.player1;
    }

    //sets player 2's ID
    this.setPlayer2 = function (playerID) {
        this.player2 = playerID;
    }

    //gets player 2's ID
    this.getPlayer2 = function () {
        return this.player2ID;
    }

    //sets the instance of spaceship to the game
    this.createPlayerSpaceship = function (playerID, spaceship) {
        if ((playerID !== 1 || playerID !== 2) && spaceship !== null && spaceship instanceof Spaceship) {
            if (playerID === 1) {
                //update player 1 with a spaceship
                this.player1 = spaceship;
            } else {
                //update player 2 with a spaceship
                this.player2 = spaceship;
            }
        }
    }

    //finds if a second player is connected
    this.checkPlayer2 = function () {
        if (this.player2ID === null || this.player2ID === "") {
            return 1;
        } else {
            return 2;
        }
    }

}

module.exports = Game;