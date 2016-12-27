function Canvas(player, socket) {

    //canvas properties
    this.player = player;
    this.socket = socket;
    this.localGame = null;
    this.canvas = null;
    this.ctx = null;
    this.width = 1280;
    this.height = 680;
    this.sync = true;

    //sets a local game to the canvas.
    this.setLocalGame = function (localGame) {
        this.localGame = localGame;
    }

    //gets the local game
    this.getLocalGame = function () {
        return this.localGame;
    }

    //gets the associtated player instance
    this.getPlayer = function () {
        return this.player;
    }

    this.getBackgroundSourceColour = function () {
        return this.backgroundSourceColour;
    }

    this.createCanvas = function (stage) {

        if (!isNaN(stage) || stage == "") {
            throw "Passed incorrect type or empty string";
        }

        switch (stage) {
            case "front menu":
                return this.buildCanvas(this.width, this.height, 666, 'rgba(158, 167, 184, 0.2)');
                break;
            default:
                console.log("you have entered an incorrect stage.")
                break;

        }


    }

    this.buildCanvas = function (width, height, zIndex, backgroundColourRgba) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.zIndex = zIndex;
        canvas.style.position = "absolute";

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        return canvas;
    }

    //Modifys each canvas so it has the correct setup for where the user is
    this.modifyCanvas = function (canvas, stage, props) {

        if (!isNaN(stage) || stage == "") {
            throw "Passed incorrect type or empty string";
        }

        var ctx = canvas.getContext("2d");

        switch (stage) {
            case "front menu":
                console.log("rendering the front menu");
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                this.createCanvasText(ctx, "60px Arial", "white", "Asteroids", 520, 300);
                this.createCanvasText(ctx, "30px Arial", "white", "Liam Read", 570, 350);

                //Tell server main menu is loaded
                this.player.serverClientLocation("home screen");
                break;

            case "lobby menu":
                console.log("rendering the lobby screen");
                //clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                this.createCanvasText(ctx, "40px Arial", "white", "Lobby Menu", 30, 50);

                this.player.serverClientLocation("lobby menu");
                break;

            case "game lobby":
                console.log("rendering the game lobby screen");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                this.player.serverClientLocation("game lobby");

                break;

            case "game":
                console.log("rendering the game canvas");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                //props should hold spaceships and asteroids[spaceships[] -> asteroids[]]

                this.player.serverClientLocation("ingame");
                break;

            case "score screen":
                console.log("rendering the score screen");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
        }
    }

    //constructs a user defined lobby
    this.constructUserLobby = function (canvas, otherUser, lobbyTitle) {

        var ctx = canvas.getContext("2d");
        this.createCanvasText(ctx, "26px Arial", "white", "Game Lobby: " + lobbyTitle, 30, 50);

    }

    //Creates canvas text as a helper method
    this.createCanvasText = function (ctx, font, color, text, x, y) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        //console.log("Text Has been drawn" + ctx, font, color, text, x, y);
    }

    //flag for maintaining sigular occuring events within the game loop.
    this.setSync = function (bool) {
        this.sync = bool;
    }


    //This is used to render our players and asteroids using the local game
    this.render = function () {

        var ctx = this.canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.localGame.getOpponenetSpaceship().getHealth() > 0) {
            this.localGame.getOpponenetSpaceship().renderSpaceShip(ctx);
        }

        //render the spaceships onto the canvas using there co-ordinates
        if (this.localGame.getPlayerSpaceship().getHealth() > 0) {
            this.localGame.getPlayerSpaceship().renderSpaceShip(ctx);
        }

        //rendering scores here

        this.localGame.renderScores(ctx, this);
        this.localGame.renderLevel(ctx, this);
        this.localGame.renderHealth(ctx, this);


        for (var i = 0; i < this.localGame.getAsteroidsArr().length; i++) {
            this.localGame.getAsteroidsArr()[i].renderAsteroid(ctx);
            this.localGame.getAsteroidsArr()[i].move();
        }

        for (var x = 0; x < this.localGame.getPlayerSpaceship().getProjectiles().length; x++) {
            this.localGame.getPlayerSpaceship().getProjectiles()[x].render(ctx);
            this.localGame.getPlayerSpaceship().getProjectiles()[x].move(ctx);
        }

        for (var y = 0; y < this.localGame.getOpponenetSpaceship().getProjectiles().length; y++) {
            this.localGame.getOpponenetSpaceship().getProjectiles()[y].render(ctx);
            this.localGame.getOpponenetSpaceship().getProjectiles()[y].move(ctx);
        }

    }

    //This is used to capture events driven by the players
    this.update = function (keycodeArr) {

        var playerShip = this.localGame.getPlayerSpaceship();
        var oppShip = this.localGame.getOpponenetSpaceship();
        var asteroids = this.localGame.getAsteroidsArr();

        if ((playerShip.getHealth <= 0 && oppShip <= 0) || this.localGame.getLevel() === 11) {

        }

        if (keycodeArr[87]) {
            playerShip.forwardMove();

            //tell the other player the opponenet has moved
            socket.emit('opponenentMovedForward', {
                lobbyID: this.player.getLobbyID()
            });

        }

        if (keycodeArr[65]) {
            playerShip.turnLeft();

            socket.emit('opponenentMovedLeft', {
                lobbyID: this.player.getLobbyID()
            });
        }

        if (keycodeArr[68]) {
            playerShip.turnRight();

            socket.emit('opponenentMovedRight', {
                lobbyID: this.player.getLobbyID()
            });
        }

        //player spaceship

        //finding if the x co-ordinates matchs left wall
        if (playerShip.getX() <= 0) {
            playerShip.setX(this.width - 0.01);
        }

        //finding if the x co-ordinates matchs right wall
        if (playerShip.getX() >= this.width) {
            playerShip.setX(0.01);
        }

        //finding if the x co-ordinates matchs bottom wall
        if (playerShip.getY() <= 0) {
            playerShip.setY(this.height - 0.01);
        }

        //finding if the x co-ordinates matchs top wall
        if (playerShip.getY() >= this.height) {
            playerShip.setY(0.01);
        }

        //opponent spaceship

        //finding if the x co-ordinates matchs left wall
        if (oppShip.getX() <= 0) {
            oppShip.setX(this.width - 0.01);
        }

        //finding if the x co-ordinates matchs right wall
        if (oppShip.getX() >= this.width) {
            oppShip.setX(0.01);
        }

        //finding if the x co-ordinates matchs bottom wall
        if (oppShip.getY() <= 0) {
            oppShip.setY(this.height - 0.01);
        }

        //finding if the x co-ordinates matchs top wall
        if (oppShip.getY() >= this.height) {
            oppShip.setY(0.01);
        }

        for (var i = 0; i < asteroids.length; i++) {
            //finding if the x co-ordinates matchs left wall
            if (asteroids[i].getX() <= 0) {
                asteroids[i].setX(this.width - 0.01);
            }

            //finding if the x co-ordinates matchs right wall
            if (asteroids[i].getX() >= this.width) {
                asteroids[i].setX(0.01);
            }

            //finding if the x co-ordinates matchs bottom wall
            if (asteroids[i].getY() <= 0) {
                asteroids[i].setY(this.height - 0.01);
            }

            //finding if the x co-ordinates matchs top wall
            if (asteroids[i].getY() >= this.height) {
                asteroids[i].setY(0.01);
            }
        }

        //loop over all asteroids and check if the distance between them and the player is close enough for a collision. aabb scenario.
        for (var x = 0; x < asteroids.length; x++) {
            if (playerShip.getX() < asteroids[x].getX() + asteroids[x].getSize() &&
                playerShip.getX() + playerShip.getSide() > asteroids[x].getX() &&
                playerShip.getY() < asteroids[x].getY() + asteroids[x].getSize() &&
                playerShip.getSide() + playerShip.getY() > asteroids[x].getY()) {

                if (playerShip.getProtection() !== true) {
                    //notify the server that a player has been hit.
                    socket.emit('playerHitByAsteroid', {
                        lobbyID: this.player.getLobbyID(),
                        playerID: this.player.getId()
                    });

                    playerShip.decreaseHealth();

                    this.localGame.getPlayerSpaceship().setProtection(true);

                    //changes the vunerablity back on.
                    changeProtection(this.localGame.getPlayerSpaceship());
                }
                console.log(playerShip);
            }
        }

        var bullets = playerShip.getProjectiles();

        for (var x = 0; x < asteroids.length; x++) {
            for (var i = 0; i < bullets.length ; i++) {
                if (asteroids[x].getX() < bullets[i].getX() + bullets[i].getWidth() &&
                    asteroids[x].getX() + asteroids[x].getSize() > bullets[i].getX() &&
                    asteroids[x].getY() < bullets[i].getY() + bullets[i].getHeight() &&
                    asteroids[x].getSize() + asteroids[x].getY() > bullets[i].getY()) {

                    socket.emit('asteroidHitByPlayer', {
                        lobbyID: this.player.getLobbyID(),
                        asteroidID: x,
                        bulletID: i,
                        cords: [asteroids[x].getX(), asteroids[x].getY()],
                        tier: asteroids[x].getTier()
                    });

                    this.localGame.addPlayerScore();
                    asteroids.splice(x, 1);
                    bullets.splice(i, 1);


                }
            }
        }

        for (var x = 0; x < playerShip.getProjectiles().length; x++) {
            if (playerShip.getProjectiles()[x].getX() <= 0 || playerShip.getProjectiles()[x].getX() >= this.width || playerShip.getProjectiles()[x].getY() <= 0 || playerShip.getProjectiles()[x].getY() >= this.height) {
                playerShip.getProjectiles().splice(x, 1);
            }
        }

        for (var x = 0; x < oppShip.getProjectiles().length; x++) {
            if (oppShip.getProjectiles()[x].getX() <= 0 || oppShip.getProjectiles()[x].getX() >= this.width || oppShip.getProjectiles()[x].getY() <= 0 || oppShip.getProjectiles()[x].getY() >= this.height) {
                oppShip.getProjectiles().splice(x, 1);
            }
        }

        //no asteroids are left.
        if (asteroids.length == 0 && this.localGame.getLevelScore() && this.sync) {

            socket.emit('asteroidsDeafeated', {
                lobbyID: this.player.getLobbyID(),
                player: this.player.getId(),
                level: this.localGame.getLevel()
            });

            console.log("level updated.");
            //set sync to false so no further executions are possible till replenishment.
            this.sync = false;
        }



    }

    function changeProtection(playerSpacehsip) { 
        setTimeout(function() {playerSpacehsip.setProtection(false);},4000);
    }

}