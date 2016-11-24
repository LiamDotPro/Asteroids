function player(id, socket) {

    this.location = "Not Loaded";
    this.playerSocket = socket;
    this.playerID = id;

    this.getLocation = function () {
        return this.location;
    }

    this.setLocation = function (newLocation) {
        this.location = newLocation;
    }


    this.ClientLoaded = function () {
        this.location = "Home Screen";
        socket.emit('clientLoaded', {
            id: this.playerID
        });
    }
}