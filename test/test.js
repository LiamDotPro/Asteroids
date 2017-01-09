var assert = require('assert');
var expect = require("chai").expect;

var Spaceship = require('../src/SrvSpaceship.js');
var Projectile = require('../src/SrvProjectile.js');
var Asteroid = require('../src/SrvAsteroid.js');
var Client = require('../src/Client.js');

//making the objects we wish to test below
var testShip = new Spaceship(0, 0);
var moveShip = new Spaceship(0, 0);



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

describe("Clientside Resources ", function () {
    describe("Spaceship Test Libary and Projectile intergration tests", function () {
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

        describe("Checking starting thruster speed and changing", function () {
            it("Thruster speed should be equal to 4", function () {
                expect(testShip.getThrusterSpeed()).to.equal(4);
            });

            it("Thruster speed should be equal to 8", function () {
                testShip.setThrusterSpeed(8);
                expect(testShip.getThrusterSpeed()).to.equal(8);
            });
        });

        describe("Checking Array of location", function () {
            it("location should be equal to [1000, 233]", function () {
                expect(testShip.getLoc()).to.deep.equal([1000, 233]);
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

            it("Shooting array has reached it's limit", function () {
                for (var x = 0; x < 100; x++) {
                    testShip.shoot();
                }

                expect(testShip.shoot()).to.not.be.ok;
            });

        });

        describe("Checking the ability to move a projectile", function () {

            var projectiles = testShip.getProjectiles();

            it("Checking that calling move moves the projectiles X value", function () {

                //Moving the object 20 times
                for (var y = 0; y < 19; y++) {
                    projectiles[60].move();
                }

                //This should be the same as the triangle starts facing upwards
                expect(projectiles[60].getX()).to.equal(1000);
            });

            it("Checking that calling move moves the projectiles Y value", function () {
                expect(projectiles[60].getY()).to.equal(119);
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
                expect(testShip.getLoc()).to.deep.equal([0, 0]);
            })

        });

        describe("Testing movement of spaceship", function () {

            //Moving moveShip forward
            moveShip.forwardMove();


            it("X should be inline with a default direction turn with COS", function () {
                expect(moveShip.getX()).to.equal(-7.347880794884119e-16);
            });

            it("Y should be inline with a default direction turn with SIN", function () {
                expect(moveShip.getY()).to.equal(-4);
            });

        });

        describe("Testing the avalibity of getting the side number used for sizing", function () {
            it("Default side value for player size should be 40", function () {
                expect(testShip.getSide()).to.equal(40);
            });
        });

        describe("Testing turning left and right with the moveShip", function () {
            it("Direction should be changed to -0.1 of the current position", function () {
                //turning the ship right
                moveShip.turnRight();
                expect(moveShip.getDirection()).to.equal(4.812388980384689);
            });

            it("Direction should be changed to +0.1 of the current position", function () {
                //turning the ship left
                moveShip.turnLeft();
                expect(moveShip.getDirection()).to.equal(4.71238898038469);
            });
        });

        describe("Checking if shield is activatable", function () {
            it("Shield should be false", function () {
                expect(testShip.getShield()).to.not.be.ok;
            });


            it("Shield should be true", function () {
                testShip.setShield();
                expect(testShip.getShield()).to.be.ok;
            });

        });

        describe("Checking set location using function is functioning correctly", function () {
            it("Checking passing X", function () {
                testShip.setLocation(300, 488);
                expect(testShip.getX()).to.equal(300);
            });

            it("Checking passing Y", function () {
                expect(testShip.getY()).to.equal(488);
            });
        });
    });

    var testProjectile = new Projectile(10, 20, 4.6);

    describe("Projectile Test Libary", function () {

        describe("Getting the X value", function () {
            it("Should return 10", function () {
                expect(testProjectile.getX()).to.equal(10);
            });
        });

        describe("Getting the Y value", function () {
            it("Should return 20", function () {
                expect(testProjectile.getY()).to.equal(20);
            });
        });

        describe("Getting the Width value", function () {
            it("Should return default value", function () {
                expect(testProjectile.getWidth()).to.equal(5);
            });
        });

        describe("Getting the Height value", function () {
            it("Should return default value", function () {
                expect(testProjectile.getHeight()).to.equal(15);
            });
        });

        describe("Getting the Direction", function () {
            it("Should return 4.6", function () {
                expect(testProjectile.getDir()).to.equal(4.6);
            });
        });

        describe("Getting the Speed value", function () {
            it("Should return 6", function () {
                expect(testProjectile.getSpeed()).to.equal(6);
            });
        });

        describe("Checking the movement of the produced projectile", function () {
            it("X value should change in accordance to Cos", function () {

                //Only move once so were able to calculate where the projectile should move to
                testProjectile.move();

                expect(testProjectile.getX()).to.equal(9.32708483838967);
            });

            it("Y value should change in accordance to Sin", function () {
                expect(testProjectile.getY()).to.equal(14.037853978199212);
            });
        });
    });

    var testAsteroid = new Asteroid(1, 2, 30, 1.6, 3);

    describe("Asteroid Test Libary", function () {

        describe("Checking the inial X value", function () {
            it("X value should return 1", function () {
                expect(testAsteroid.getX()).to.equal(1);
            });
        });

        describe("Checking the inial Y value", function () {
            it("Y value should return 2", function () {
                expect(testAsteroid.getY()).to.equal(2);
            });
        });

        describe("Checking the inital Size value", function () {
            it("Size value should return 30", function () {
                expect(testAsteroid.getSize()).to.equal(30);
            });
        });

        describe("Checking the inital direction value", function () {
            it("Direction value should return 1.6", function () {
                expect(testAsteroid.getDir()).to.equal(1.6);
            });
        });

        describe("Checking the inital tier value", function () {
            it("Speed value should return 2", function () {
                expect(testAsteroid.getSpeed()).to.equal(2);
            });
        });

        describe("Checking the inital Speed value", function () {
            it("Tier value should return 3", function () {
                expect(testAsteroid.getTier()).to.equal(3);
            });
        });

        describe("Checking setting new X and Y co-ordinates", function () {
            it("Should assign the new value of 123 to X", function () {
                testAsteroid.setX(123);
                expect(testAsteroid.getX()).to.equal(123);
            });

            it("Should assign the new value of 456 to Y", function () {
                testAsteroid.setY(456);
                expect(testAsteroid.getY()).to.equal(456);
            });
        });

        describe("Checking movement occurs when calling move on an asteroid", function () {

            describe("Checking X and Y values - moving once", function () {
                it("Checking X value after move", function () {
                    testAsteroid.move();
                    expect(testAsteroid.getX()).to.equal(122.94160095539742);

                });

                it("Checking Y value after move", function () {
                    expect(testAsteroid.getY()).to.equal(457.999147206083);
                })
            });

            describe("Checking X and Y values moving five times", function () {
                it("Checking X value after moves", function () {
                    for (var x = 0; x < 4; x++) {
                        testAsteroid.move();
                    }

                    expect(testAsteroid.getX()).to.equal(122.7080047769871);

                });

                it("Checking Y value after moves", function () {
                    expect(testAsteroid.getY()).to.equal(465.9957360304151);
                })
            });

        });

    });
});

describe("Serverside Resources", function () {

    var testClient = new Client(12345678, [1, 2]);

    describe("Client Test Libary", function () {

        describe("Turning off logging for testing", function () {

            if ("Logging value should be false", function () {
                expect(testClient.getLogging()).to.be.ok;
            });
        });

        describe("Checking Inital ID", function () {
            it("Inital ID should equal 12345678", function () {
                expect(testClient.getId()).to.equal(12345678);
            });
        });

        describe("Checking Socket is assigned", function () {
            it("Should return an array with multiple entires", function () {
                expect(testClient.getClientSocket()).to.deep.equal([1,2]);
            });
        });

        describe("Checking your able to assign a new location", function () {
            it("Inital value is empty", function () {
                expect(testClient.getClientLoc()).to.equal("");
            });

            it("Location should be updated", function () {
                testClient.setLocation("front menu");
                expect(testClient.getClientLoc()).to.equal("front menu");
            });
        });


    });
});