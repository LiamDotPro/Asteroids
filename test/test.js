﻿var assert = require('assert');
var expect = require("chai").expect;
var ineeda = require('ineeda').ineeda;

var Spaceship = require('../src/SrvSpaceship.js');
var Projectile = require('../src/SrvProjectile.js');
var Asteroid = require('../src/SrvAsteroid.js');
var Client = require('../src/Client.js');
var Game = require('../src/Game.js');
var UUID = require('../src/UUID.js');

//making the objects we wish to test below
var testShip = new Spaceship(0, 0);
var moveShip = new Spaceship(0, 0);


describe("mock test", function () {
    describe("Testing Mock of SpaceShip and projectiles", function () {
        it("should return a new mock of spaceship", function () {
            var spaceship = ineeda({name: 'fred'});
            console.log(spaceship);
            expect(spaceship.name).to.equal('fred');
        });
    });
});



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

        //These tests turn off logging for the class so messages don't appear on the report
        //but are left on by default for the program.
        describe("Turning off logging for testing", function () {

            it("Logging value should be true", function () {
                expect(testClient.getLogging()).to.be.ok;
            });

            it("Logging value should be false", function () {
                testClient.setLogging(false);
                expect(testClient.getLogging()).to.not.be.ok;
            });
        });

        describe("Checking Inital ID", function () {
            it("Inital ID should equal 12345678", function () {
                expect(testClient.getId()).to.equal(12345678);
            });
        });

        describe("Checking Socket is assigned", function () {
            it("Should return an array with multiple entires", function () {
                expect(testClient.getClientSocket()).to.deep.equal([1, 2]);
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

        describe("Checking inital lobby number", function () {
            it("The inital value should be 0", function () {
                expect(testClient.getLobbyNum()).to.equal(0);
            });

            it("The inital value should be 1234", function () {
                testClient.setLobbyNum(1234);
                expect(testClient.getLobbyNum()).to.equal(1234);
            });
        });

        describe("checking assigning client room", function () {
            it("Inital value should be null", function () {
                expect(testClient.getClientRoom()).to.equal(null);
            });

            it("Assigning a lobby and getting the identifer", function () {
                testClient.setClientRoom([]);
                expect(testClient.getClientRoom()).to.deep.equal([]);
            });
        });

    });

    var testGame = new Game(12333, "u1u2u3");

    describe("Game Test Libary", function () {
        describe("Checking Game ID", function () {
            it("Should return the passed value on startup", function () {
                expect(testGame.getLobbyID()).to.equal(12333);
            });
        });

        describe("getting and setting of Player ID's", function () {
            it("Should return the inital user id for player 1", function () {
                expect(testGame.getPlayer1ID()).to.equal("u1u2u3");
            });

            it("Should return empty string when no second user is present", function () {
                expect(testGame.getPlayer2ID()).to.equal("");
            });

            it("Should return an updated string when a second user is present", function () {
                testGame.setPlayer2("u3u3u3");
                expect(testGame.getPlayer2ID()).to.equal("u3u3u3");
            });
        });

        describe("Creating serverside representation of spaceships", function () {
            it("Should create spaceships inside the class", function () {
                testGame.createPlayerSpaceship(new Spaceship(0, 0), new Spaceship(0, 0));
                expect(testGame.getSpaceShipP1()).to.not.be.null;
                expect(testGame.getSpaceShipP2()).to.not.be.null;
            });
        });

        describe("Checking for a second player in a game", function () {
            it("Should return 2 as a second player is present", function () {
                expect(testGame.checkPlayer2()).to.equal(2);
            });

            it("Should return 1 when a second player is not present", function () {
                testGame.setPlayer2("");
                expect(testGame.checkPlayer2()).to.equal(1);
            });
        });

        describe("Checking inital lobby status and changing status", function () {

            it("Inital state of the lobby should be InLobby", function () {
                expect(testGame.getLobbyStatus()).to.equal("InLobby");
            });

            it("Checking if lobby is now Playing", function () {
                testGame.setLobbyStatus("Playing");
                expect(testGame.getLobbyStatus()).to.equal("Playing");
            });

        });

        describe("checking setting player status in lobby", function () {

            it("Player 1 status should return false initally", function () {
                expect(testGame.getPlayerStatus("u1u2u3")).to.equal(false);
            });

            it("Player 1 status should return true after change", function () {
                testGame.setPlayerStatus("u1u2u3");
                expect(testGame.getPlayerStatus("u1u2u3")).to.equal(true);
            });

            it("Player 2 status should return false initally", function () {
                testGame.setPlayer2("y2y2y2");
                expect(testGame.getPlayerStatus("y2y2y2")).to.equal(false);
            });

            it("Player 2 status should return true after change", function () {
                testGame.setPlayerStatus("y2y2y2");
                expect(testGame.getPlayerStatus("y2y2y2")).to.equal(true);
            });
        });

        //This is used when attempting to start a game
        describe("Checking both players ready up status", function () {
            it("Should return true for both players", function () {
                expect(testGame.getPlayerReadStatus()).to.equal(true);
            });

            it("Should return false for both players", function () {
                testGame.setPlayerStatus("y2y2y2");
                expect(testGame.getPlayerReadStatus()).to.equal(false);
            });

        });
    });

    var testUUID = new UUID();

    describe("UUID Test Libary", function () {
        describe("Testing creation of UUID", function () {
            it("should return a UUID", function () {
                testUUID.generateUUID();
                expect(testUUID).to.not.equal(0);
            });
        });
    });
});