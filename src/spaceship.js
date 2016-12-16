var Spaceship = function spaceship(x, y) {

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

    this.getForward = function () {
        return this.forward;
    }

    this.getLeft = function () {
        return this.left;
    }

    this.getRight = function () {
        return this.right;
    }

    this.getDown = function () {
        return this.down;
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
};

module.exports = Spaceship;