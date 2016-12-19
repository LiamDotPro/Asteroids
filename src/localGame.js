function Spaceship(x, y) {
    //small form locations.
    this.x = x;
    this.y = y;

    //full location
    this.loc = [x, y];

    //array for holding projectiles thrown by this ship
    this.projectiles = [];

    //spaceship speed
    this.thrusterSpeed = 20;

    //spaceship health and shield
    this.health = 100;
    this.shield = 100;

    //The direction the spaceship is heading
    this.direction = 0;

    //methods

    //get methods
    this.getHealth = function () {
        return this.health;
    }

    this.getShield = function () {
        return this.shield;
    }

    this.getX = function () {
        return this.x;
    }

    this.getY = function () {
        return this.y;
    }

    this.getThrusterSpeed = function () {
        return this.thrusterSpeed;
    }

    this.forwardMove = function(){
        this.y -= 5;
    }

    this.turnRight = function () {
        this.direction += -0.1;
    }

    this.turnLeft = function () {
        this.direction += 0.1;
    }


    this.getLoc = function () {
        return this.loc;
    }

    //set methods
    this.setHealth = function (newHp) {
        this.health = hp;
    }

    this.setShield = function (newShield) {
        this.shield = newShield;
    }

    this.setX = function (newX) {
        this.x = newX;
        this.updateLoc();
    }

    this.setY = function (newY) {
        this.y = newY;
        this.updateLoc();
    }

    this.setThrusterSpeed = function (newSpeed) {
        this.thrusterSpeed = newSpeed;
    }

    this.setLocation = function (x, y) {
        this.loc = [x, y];
        this.x = x;
        this.y = y;
    }

    //damage methods

    this.applyDamageToShield = function (dmg) {
        this.shield = shield - dmg;
    }

    this.applyDamageToHealth = function (dmg) {
        this.health = health - dmg;
    }

    //update methods

    this.updateLoc = function () {
        this.loc = [this.x, this.y];
    }

    //log methods

    this.logCordinates = function () {
        console.log('x: ' + this.x + " y: " + this.y);
    }

    this.logControls = function () {
        console.log("up: " + this.forward + ", left: " + this.left + ", right: " + this.right + ", Shield: " + this.down);
    }

    this.logShipStatus = function () {
        if (this.shield == 100) {
            console.log("Ship has maximum shield");
        } else if (this.shield > 50) {
            console.log("ship has more than 50% shield");
        } else {
            console.log("ship has less than 50% shield");
        }
    }

    //reset ship

    this.resetShip = function (loc) {
        this.x = loc[0];
        this.y = loc[1];
        this.loc = loc;
        this.health = 100;
        this.shield = 100;
        this.thrusterSpeed = 20;
    }

    //render methods

    this.renderSpaceShip = function(ctx) {

        var ctx = ctx;

        var side = 40;

        var h = side * (Math.sqrt(3) / 2);

        ctx.save();

        //This holds where the triangle should be
        ctx.translate(this.x, this.y);
        ctx.rotate(this.direction);
        ctx.beginPath();

        ctx.moveTo(0, -h / 2);
        ctx.lineTo(-side / 2, h / 2);
        ctx.lineTo(side / 2, h / 2);
        ctx.lineTo(0, -h / 2);

        ctx.strokeStyle = "white";

        ctx.closePath();

        ctx.stroke();

        ctx.restore();

    }
}


function localGame(StartingLocationPlayer,StartingLocationOpp) {

    this.asteroids = [];

    this.playerSpaceship = new Spaceship(StartingLocationPlayer[0], StartingLocationPlayer[1]);
    this.opponenetSpaceship = new Spaceship(StartingLocationOpp[0], StartingLocationOpp[1]);


    this.getPlayerSpaceship = function () {
        return this.playerSpaceship;
    }

    this.getOpponenetSpaceship = function () {
        return this.opponenetSpaceship;
    }

    this.setPlayerCoordinates = function () {

    }

    this.setOpponenentCoordinates = function () {

    }
}