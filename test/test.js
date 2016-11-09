var assert = require('assert');
var expect = require("chai").expect;
var Spaceship = require('../src/spaceship.js');
var testShip = new Spaceship(0, 0, ["w", "a", "d", "s"]);


describe("Checking starting locations and defaults", function () {
    describe("Checking starting location x", function () {
        it("X Should init as 0", function () {
            expect(testShip.getX()).to.equal(0);
        });
    });
    
    
    describe("Checking starting location y", function () {
        it("Y Should init as 0", function () {
            expect(testShip.getY()).to.equal(0);
        });
    });
    
    describe("Checking for default player controls - forward", function () {
        it("Forward should be w", function () {
            expect(testShip.getForward()).to.equal("w");
        });
        
        it("Left should be a", function () {
            expect(testShip.getLeft()).to.equal("a");
        });
        
        it("Right should be d", function () {
            expect(testShip.getRight()).to.equal("d");
        });
        
        it("Shield should be s", function () {
            expect(testShip.getDown()).to.equal("s");
        });
    });
    
    describe("Checking location array after moving using location", function () {
        it("location should change to [40,60]", function () {
            testShip.setLocation(40, 60);
            expect(testShip.getLoc()).to.deep.equal([40, 60]);
        });
        
        it("location should not equal [40,60]", function () {
            testShip.setLocation(20, 60);
            expect(testShip.getLoc()).to.not.deep.equal([40, 60]);
        });

    });
    
    describe("Moving using x or y locations and checking update method", function () {
        it("location should be [40,80]", function () {
            testShip.setY(80);
            testShip.setX(40);
            expect(testShip.getLoc()).to.deep.equal([40, 80]);
        });
        
        it("location should not equal [20,80]", function () {
            testShip.setY(90);
            expect(testShip.getLoc()).to.not.deep.equal([20, 80]);
        });
        
        it("location should be [40,80]", function () {
            testShip.setX(80);
            testShip.setY(80);
            expect(testShip.getLoc()).to.deep.equal([80, 80]);
        });
        
        it("location should not equal [40,60]", function () {
            testShip.setX(90);
            testShip.setY(80);
            expect(testShip.getLoc()).to.not.deep.equal([20, 80]);
        });

    });
    
    describe("Changing thruster speed", function () {
        
        it("Thruster speed should change to 40", function () {
            testShip.setThrusterSpeed(40);
            expect(testShip.getThrusterSpeed()).to.equal(40);
        })
        
        it("Thruster speed should not change to 60", function () {
            testShip.setThrusterSpeed(40);
            expect(testShip.getThrusterSpeed()).to.not.equal(60);
        })

    });
    
    describe("Testing spaceship reset functionality", function () {
        it("reset x co-ordinate to 0", function () {
            testShip.resetShip([0, 0]);
            expect(testShip.getX()).to.equal(0);
        });
        
        it("reset y co-ordinate to 0", function () {
            expect(testShip.getY()).to.equal(0);
        });
        
        it("reset location to [0,0]", function () {
            expect(testShip.getLoc()).to.deep.equal([0, 0]);
        });
        
        it("reset health to 100", function () {
            expect(testShip.getHealth()).to.equal(100);
        });
        
        it("reset shield to 100", function () {
            expect(testShip.getShield()).to.equal(100);
        });
        
        it("reset thruster speed to 20", function () {
            expect(testShip.getThrusterSpeed()).to.equal(20);
        });
    });
    
    describe("Console log methods and set shield / health", function () {
        
        it("Should print shield at 100%", function () {
            testShip.logShipStatus();
            expect(testShip.getShield()).to.equal(100);
        });
        
        it("Should print shield at 60%", function () {
            testShip.setShield(60);
            testShip.logShipStatus();
            expect(testShip.getShield()).to.equal(60);
        });
        
        it("Should print shield at 40%", function () {
            testShip.setShield(40);
            testShip.logShipStatus();
            expect(testShip.getShield()).to.equal(40);
        });

    });


});







