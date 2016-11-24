function Canvas(player) {

    //canvas properties
    this.player = player;
    this.lobbys = [];

    this.init = function () {
        this.lobbys = new Map();
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
            case "game":
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

        switch (stage) {
            case "front menu":
                var ctx = canvas.getContext("2d");
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                this.createCanvasText(ctx, "60px Arial", "white", "Asteroids", 520, 300);
                this.createCanvasText(ctx, "30px Arial", "white", "Liam Read", 570, 350);
                this.createCanvasText(ctx, "60px Arial", "white", "Enter", 570, 600);
                canvas.addEventListener("mousemove", this.on_mousemove.bind(), false);
                canvas.addEventListener("click", on_click, false);

                //Tell server main menu is loaded
                this.player.ClientLoaded();
                break;
        }
    }



    //.addEventListener(event, (function(e) {
    //    const x = blah, y = blarg, z = poop;
    //    return function(bar) { ...  use x,y,z }
    //})(e), false)

    this.on_mousemove = function (ev) {
        var x, y;

        if (ev.layerX || ev.layerX == 0) {
        }
    }

    this.createCanvasText = function (ctx, font, color, text, x, y) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        console.log("Text Has been drawn" + ctx, font, color, text, x, y);
    }

    this.changeCanvasBackground = function (c) {

    }

    this.playerCreatedALobby = function (socket, ClientID) {

    }

    this.playerJoinedLobby = function (socket, ClientID, lobbyID) {

    }


    this.init();
}