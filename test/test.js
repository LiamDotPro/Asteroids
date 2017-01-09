var assert = require('assert');
var expect = require("chai").expect;

var Spaceship = require('../src/SrvSpaceship.js');

var Projectile = require('../src/SrvProjectile.js');

//making the objects we wish to test below
var testShip = new Spaceship(0, 0);

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


describe("Checking starting locations and defaults", function () {
    describe("Checking starting location x and moving x", function () {
        it("X Should init as 0", function () {
            expect(testShip.getX()).to.equal(0);
        });

        it("X should be 100", function () {
            testShip.setX(100);
            expect(testShip.getX()).to.equal(100);
        });

        it("X should be 1000", function () {
            testShip.setX(1000);
            expect(testShip.getX()).to.equal(1000);
        });
    });

    describe("Checking starting location y and moving y", function () {
        it("Y Should init as 0", function () {
            expect(testShip.getY()).to.equal(0);
        });

        it("Y Should be 764", function () {
            testShip.setY(764);
            expect(testShip.getY()).to.equal(764);
        });

        it("Y Should 233", function () {
            testShip.setY(233);
            expect(testShip.getY()).to.equal(233);
        });
    });

    describe("Checking starting direction", function () {
        it("Direction Should init as 4.71238898038469", function () {
            expect(testShip.getDirection()).to.equal(4.71238898038469);
        });
    });

    describe("Checking starting protection", function () {
        it("Protection should be false", function () {
            expect(testShip.getProtection()).to.equal(false);
        });

        it("Protection should be true", function () {
            testShip.setProtection(true);
            expect(testShip.getProtection()).to.equal(true);
        });

        //reseting protection status
        testShip.setProtection(false);

    });

    describe("Checking starting health and decreasing health", function () {
        it("Health should equal 3", function () {
            expect(testShip.getHealth()).to.equal(3);
        });


        it("Health should equal 2", function () {
            testShip.decreaseHealth();
            expect(testShip.getHealth()).to.equal(2);
        });

        it("Health should equal 1", function () {
            testShip.decreaseHealth();
            expect(testShip.getHealth()).to.equal(1);
        });

        it("Health should equal 0", function () {
            testShip.decreaseHealth();
            expect(testShip.getHealth()).to.equal(0);
        });

        it("Health should equal 3", function () {
            testShip.setHealth(3);
            expect(testShip.getHealth()).to.equal(3);
        });

    });

    describe("Checking starting thruster speed", function () {
        it("Thruster speed should be equal to 4", function () {
            expect(testShip.getThrusterSpeed()).to.equal(4);
        });
    });

    describe("Checking Array of location", function () {
        it("location should be equal to [1000, 233]", function () {
            expect(testShip.getLoc()).to.deep.equal([1000,233]);
        });
    });

    describe("Checking Array of projectiles and shooting", function () {
        it("Array should return empty", function () {
            expect(testShip.getProjectiles()).to.deep.equal([]);
        });

        it("Array should be length of 1", function () {
            testShip.shoot();
            var len = testShip.getProjectiles().length;
            expect(len).to.equal(1);
        });

    });

    describe("Testing the avalibility of projectile variables", function () {

        //uses the above test projectile that is created using the shoot method and tests the avalibity of varaibles - Uses first and only instance
        var projectiles = testShip.getProjectiles();
       
        //Should be previously set X of 1000
        it("X is equal to 1000", function () {
            expect(projectiles[0].getX()).to.equal(1000);
        });

        it("Y is equal to 233", function () {
            expect(projectiles[0].getY()).to.equal(233);
        });

        it("Checking direction is equal to spaceship direction", function () {
            expect(projectiles[0].getDir()).to.equal(4.71238898038469);
        })

        it("Getting width", function () {
            expect(projectiles[0].getWidth()).to.equal(5);
        })

        it("Getting Height", function () {
            expect(projectiles[0].getHeight()).to.equal(15);
        });

    });

    describe("Testing reseting of the spaceship", function () {
        it("This should reset the spaceship using the reset method", function () {
            testShip.resetShip([0, 0]);
            expect(testShip.getX()).to.equal(0);
            expect(testShip.getY()).to.equal(0);
            expect(testShip.getThrusterSpeed()).to.equal(4);
            expect(testShip.getHealth()).to.equal(3);
            expect(testShip.getLoc()).to.deep.equal([0,0]);
        })

    });

});