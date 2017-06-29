function Projectile(x, y, dir) {
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

    this.getDir = function () {
        return this.direction;
    }

    this.getWidth = function () {
        return this.width;
    }

    this.getHeight = function () {
        return this.height;
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
var Spaceship = function (x, y) {
    //small form locations.
    this.x = x;
    this.y = y;
    this.side = 40;

    //full location
    this.loc = [x, y];

    //array for holding projectiles thrown by this ship
    this.projectiles = [];

    //spaceship speed
    this.thrusterSpeed = 4;
    this.friction = 0.98;

    //spaceship health
    this.health = 3;

    //respawnProtection
    this.protection = false;

    //The direction the spaceship is heading
    this.direction = 3 * Math.PI / 2;

    //The shield activated when pressing down
    this.sheild = false;

    //methods

    //get methods
    this.getHealth = function () {
        return this.health;
    };

    //gets the protection status
    this.getProtection = function () {
        return this.protection;
    };

    //gets the x status
    this.getX = function () {
        return this.x;
    };

    //gets the Y status
    this.getY = function () {
        return this.y;
    };

    //gets the side value for the spaceship
    this.getSide = function () {
        return this.side;
    };

    //gets the current state of the shield
    this.getShield = function () {
        return this.sheild;
    };

    //gets the thruster speed
    this.getThrusterSpeed = function () {
        return this.thrusterSpeed;
    };

    //moves the spaceship forward uses * rather than + for smoother movement
    this.forwardMove = function () {
        this.x += this.thrusterSpeed * Math.cos(this.direction);
        this.y += this.thrusterSpeed * Math.sin(this.direction);
    };

    //this will change the direction of the spaceship
    this.turnRight = function () {
        this.direction += 0.1;
    };


    this.turnLeft = function () {
        this.direction += -0.1;
    };

    //gets the current location of the spaceship
    this.getLoc = function () {
        return this.loc;
    };

    //gets the current direciton of the spaceship
    this.getDirection = function () {
        return this.direction;
    };

    //gets the array of projectiles associated with this spaceship
    this.getProjectiles = function () {
        return this.projectiles;
    };

    //set methods
    this.setHealth = function (newHp) {
        this.health = newHp;
    };

    //decreases the health of the spaceship
    this.decreaseHealth = function () {
        this.health -= 1;
    };

    //Sets the shield for the ship - not implemeted
    this.setShield = function () {
        this.sheild ? this.sheild = false : this.sheild = true;
    };

    //sets the a new X axis
    this.setX = function (newX) {
        this.x = newX;
        this.updateLoc();
    };

    //sets a new Y axis
    this.setY = function (newY) {
        this.y = newY;
        this.updateLoc();
    };

    //sets the thruster speed for the ship
    this.setThrusterSpeed = function (newSpeed) {
        this.thrusterSpeed = newSpeed;
    };

    //sets the location array using x and y
    this.setLocation = function (x, y) {
        this.loc = [x, y];
        this.x = x;
        this.y = y;
    };

    //Causes a new shot to be added
    this.shoot = function () {
        if (this.projectiles.length <= 100 && this.health > 0) {
            this.projectiles.push(new Projectile(this.x, this.y, this.direction));
            return true;
        } else {
            return false;
        }
    };

    this.setProtection = function (bool) {
        this.protection = bool;
    };

    //update methods

    this.updateLoc = function () {
        this.loc = [this.x, this.y];
    };

    //log methods

    // Below methods are live in the program files but Can't be tested due to framework and testing
    // via server side modules.

    //this.logCordinates = function () {
    //   console.log('x: ' + this.x + " y: " + this.y);
    //}

    //reset ship

    this.resetShip = function (loc) {
        this.x = loc[0];
        this.y = loc[1];
        this.loc = loc;
        this.health = 3;
        this.thrusterSpeed = 4;
    };


    //render methods

    this.renderSpaceShip = function (ctx) {

        var side = this.side;

        var h = side * (Math.sqrt(3) / 2);

        ctx.save();

        //This holds where the triangle should be
        ctx.translate(this.x, this.y);
        ctx.rotate(this.direction + Math.PI / 2);
        ctx.beginPath();

        ctx.moveTo(0, -h / 2);
        ctx.lineTo(-side / 2, h / 2);
        ctx.lineTo(side / 2, h / 2);
        ctx.lineTo(0, -h / 2);

        if (this.protection === true) {
            ctx.strokeStyle = "blue";
        } else {
            ctx.strokeStyle = "white";
        }

        ctx.closePath();

        ctx.stroke();

        ctx.restore();

    }


}

module.exports = Spaceship;