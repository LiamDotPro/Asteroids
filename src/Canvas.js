function Canvas(player, socket) {

    //canvas properties
    this.player = player;
    this.socket = socket;
    this.lobbys = new Map();

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
        return canvas;
    }

    //Modifys each canvas so it has the correct setup for where the user is
    this.modifyCanvas = function (canvas, stage) {

        if (!isNaN(stage) || stage == "") {
            throw "Passed incorrect type or empty string";
        }

        var ctx = canvas.getContext("2d");

        switch (stage) {
            case "front menu":
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                this.createCanvasText(ctx, "60px Arial", "white", "Asteroids", 520, 300);
                this.createCanvasText(ctx, "30px Arial", "white", "Liam Read", 570, 350);

                //Tell server main menu is loaded
                this.player.serverClientLocation("home screen");
                break;

            case "lobby menu":
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
        }
    }

    //Creates canvas text as a helper method
    this.createCanvasText = function (ctx, font, color, text, x, y) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        console.log("Text Has been drawn" + ctx, font, color, text, x, y);
    }

    //Creates a new instance of lobby object inside the canvas
    this.lobbyCreated = function (lobbyID) {
        this.lobbys.set(lobbyID, new localGame());
        console.log("New lobby made : " + lobbyID);
    }

}