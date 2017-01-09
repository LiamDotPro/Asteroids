var Asteroid = function (x, y, size, dir, tier) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.direction = dir;
    this.speed = 2;
    this.tier = tier;

    //renders the asteroid
    this.renderAsteroid = function (ctx) {
        ctx.strokeStyle = "white";

        //build asteroid here
        ctx.strokeRect(this.x, this.y, this.size, this.size);
    }

    //moves the asteroid
    this.move = function () {
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);
    }

    //gets the X axis
    this.getX = function () {
        return this.x;
    }

    //gets the Y axis
    this.getY = function () {
        return this.y;
    }

    //Gets the size of the asteroid
    this.getSize = function () {
        return this.size;
    }

    //Gets the direction of the asteroid
    this.getDir = function () {
        return this.direction;
    }

    //Sets the X co-ordinate
    this.setX = function (newX) {
        this.x = newX;
    }

    //Sets the Y co-ordinate
    this.setY = function (newY) {
        this.y = newY;
    }

    //gets the tier of asteroid
    this.getTier = function () {
        return this.tier;
    }
    
    //gets the speed of an asteroid
    this.getSpeed = function () {
        return this.speed;
    }

}

module.exports = Asteroid;