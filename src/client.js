var Client = function (id) {
    this.id = id;
    this.lobby = 0;

    this.getLobbyStatus = function () {
        if (this.lobby === 0) {
            return false;
        }
        else {
            return true;
        }
    }

    this.getId = function () {
        return this.id;
    }

    //sets a clients instance
    this.setLobby = function (lobbyNumber) {
        try {
            if (lobbyNumber > 0) {
                this.lobby = lobbyNumber;
            } else {
                throw new Error("Unexspected number or type");
            }
        } catch (e) {
            alert(e);
            console.log(e);
        }
    }

    //resets the lobby number to default 0 - not in lobby
    this.resetLobby = function () {
        this.lobby = 0;
    }
}

module.exports = Client;