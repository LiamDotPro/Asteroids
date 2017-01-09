var Projectile = function (x, y, dir) {
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.speed = 6;
    this.width = 5;
    this.height = 15;

    this.getX = function () {
        return this.x;
    }

    this.getY = function () {
        return this.y;
    }

    this.getWidth = function () {
        return this.width;
    }

    this.getHeight = function () {
        return this.height;
    }

    this.getDir = function () {
        return this.direction;
    }

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