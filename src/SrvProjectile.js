var Projectile = function (x, y, dir) {
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.speed = 6;
    this.width = 5;
    this.height = 15;

    //gets the current X value of the projectile
    this.getX = function () {
        return this.x;
    }

    //gets the current Y value of the projectile
    this.getY = function () {
        return this.y;
    }

    //gets the current Speed value of the projectile
    this.getSpeed = function () {
        return this.speed;
    }

    //gets the current Width value of the projectile
    this.getWidth = function () {
        return this.width;
    }

    //gets the current Height value of the projectile
    this.getHeight = function () {
        return this.height;
    }

    //gets the current Direction value of the projectile
    this.getDir = function () {
        return this.direction;
    }

    //Moves the projectile in the direction current assigned
    this.move = function () {
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);
    }

    //renders the bullet to the screen
    this.render = function (ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}

module.exports = Projectile;