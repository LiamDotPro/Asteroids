class Bullets {

}

class Spaceship {

    x: number;
    y: number;
    loc: Array<number> = [];
    projectiles: Array<Bullets>;


    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.loc = [x, y];
        this.projectiles = [];
    }

}

//simple client class which numbers clients on the way in
//and attaches a lobby id if they enter a lobby.
class Client {

    clientID: number;
    lobbyID: string;

    constructor(clientId: number) {
        this.clientID = clientId;
        this.lobbyID = "";
    }

    getLobbyId(): string {
        return this.lobbyID;
    }

    getClientID(): number {
        return this.clientID;
    }

    setLobbyId(newlobbyid: string) {
        this.lobbyID = newlobbyid;
    }

    setClientID(newclientid: number) {
        this.clientID = newclientid;
    }

    findIfInLobby(): boolean {

        if (!this.lobbyID || this.lobbyID.length === 0) {
            return false;
        }
        else {
            return true;
        }

    }

}