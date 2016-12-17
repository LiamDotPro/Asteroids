function Canvas(player, socket) {

    //canvas properties
    this.player = player;
    this.socket = socket;
    this.lobby;
    this.canvas;

    //sets a local game to the canvas.
    this.setLocalGame = function (localGame) {
        this.lobby = localGame;
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
                return this.buildCanvas(1280, 680, 666, 'rgba(158, 167, 184, 0.2)');
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
                requestAnimationFrame(this.render);

                this.player.serverClientLocation("ingame");
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
        console.log("Text Has been drawn" + ctx, font, color, text, x, y);
    }


    //rendering function use in the game
    this.render = function () {
        var ctx = canvas.getContext('2d');

        var side = 20;

        var h = 80 * (Math.sqrt(3) / 2);



        ctx.translate(300, 400);

        ctx.beginPath();

        ctx.moveTo(0, -h / 2);
        ctx.lineTo(-side / 2, h / 2);
        ctx.lineTo(side / 2, h / 2);
        ctx.lineTo(0, -h / 2);
        


      

        ctx.strokeStyle = "white";

        ctx.stroke();

        ctx.closePath();
    }

}