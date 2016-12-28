function Spaceship(x, y) {
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

    //methods

    //get methods
    this.getHealth = function () {
        return this.health;
    }

    this.getProtection = function () {
        return this.protection;
    }

    this.getX = function () {
        return this.x;
    }

    this.getY = function () {
        return this.y;
    }

    this.getSide = function () {
        return this.side;
    }

    this.getThrusterSpeed = function () {
        return this.thrusterSpeed;
    }

    this.forwardMove = function () {
        this.x += this.thrusterSpeed * Math.cos(this.direction);
        this.y += this.thrusterSpeed * Math.sin(this.direction);
    }

    this.turnRight = function () {
        this.direction += 0.1;

    }

    this.turnLeft = function () {
        this.direction += -0.1;
    }


    this.getLoc = function () {
        return this.loc;
    }

    this.getProjectiles = function () {
        return this.projectiles;
    }


    //set methods
    this.setHealth = function (newHp) {
        this.health = hp;
    }

    this.decreaseHealth = function () {
        this.health -= 1;
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

    this.shoot = function () {
        if (this.projectiles.length <= 100) {
            this.projectiles.push(new Projectile(this.x, this.y, this.direction));
            return true;
        } else {
            return false;
        }
    }

    this.setProtection = function (bool) {
        this.protection = bool;
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

function Asteroid(x, y, size, dir, tier) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.direction = dir;
    this.speed = 2;
    this.tier = tier;


    this.renderAsteroid = function (ctx) {
        ctx.strokeStyle = "white";

        //build asteroid here
        ctx.strokeRect(this.x, this.y, this.size, this.size);

    }

    this.move = function () {
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);
    }

    this.getX = function () {
        return this.x;
    }

    this.getY = function () {
        return this.y;
    }

    this.getSize = function () {
        return this.size;
    }

    this.setX = function (newX) {
        this.x = newX;
    }

    this.setY = function (newY) {
        this.y = newY;
    }

    this.getTier = function () {
        return this.tier;
    }

}

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


function localGame(StartingLocationPlayer, StartingLocationOpp) {

    this.asteroids = [];
    this.levelScore = generateLevelScores();

    this.playerSpaceship = new Spaceship(StartingLocationPlayer[0], StartingLocationPlayer[1]);
    this.opponenetSpaceship = new Spaceship(StartingLocationOpp[0], StartingLocationOpp[1]);

    this.playerScore = 0;
    this.oppScore = 0;
    this.level = 0;


    this.getPlayerSpaceship = function () {
        return this.playerSpaceship;
    }

    this.getOpponenetSpaceship = function () {
        return this.opponenetSpaceship;
    }

    this.getPlayerScore = function () {
        return this.playerScore;
    }

    this.getOppScore = function () {
        return this.oppScore;
    }

    this.getAsteroidsArr = function () {
        return this.asteroids;
    }

    this.addAsteroids = function (arrOfAsteroids) {
        for (var i = 0; i < arrOfAsteroids.length; i++) {
            var a = arrOfAsteroids[i];
            //x, y, size, dir
            this.asteroids.push(new Asteroid(a.loc[0], a.loc[1], a.size, a.dir, a.tier));
            console.log(arrOfAsteroids);
        }
    }

    this.renderScores = function (ctx, canvasObj) {
        canvasObj.createCanvasText(ctx, "20px Arial", "white", "Your Score:" + this.playerScore, 10, 40);
        canvasObj.createCanvasText(ctx, "20px Arial", "white", "Opponent Score:" + this.oppScore, 1050, 40);
    }

    this.renderLevel = function (ctx, canvasObj) {
        canvasObj.createCanvasText(ctx, "20px Arial", "white", "Level " + this.level, 500, 40);
    }

    this.renderHealth = function (ctx, canvasObj) {
        canvasObj.createCanvasText(ctx, "20px Arial", "white", "life: " + this.playerSpaceship.getHealth(), 10, 80);
        canvasObj.createCanvasText(ctx, "20px Arial", "white", "life: " + this.opponenetSpaceship.getHealth(), 1050, 80);
    }

    this.addPlayerScore = function () {
        this.playerScore += 10;
    }

    this.addOppScore = function () {
        this.oppScore += 10;
    }

    this.increaseLevel = function () {
        this.level++;
    }

    this.getLevel = function () {
        return this.level;
    }

    this.getLevelScore = function () {
        var score = this.levelScore[this.level];
        if (score === (this.playerScore + this.oppScore)) {
            return true;
        } else {
            return false;
        }
    }

    function generateLevelScores() {
        var tempArr = [];
        var counter = 2;
        for (var x = 0; x < 3; x++) {
            tempArr.push(counter * 130);
            counter = counter * 2;
        }
        console.log(tempArr);
        return tempArr;
    }

}