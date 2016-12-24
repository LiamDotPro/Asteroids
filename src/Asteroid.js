var Asteroid = function asteroid(tier, loc) {

    this.loc = generateCords();
    this.size = sizeByTier();
    this.dir = Math.PI * 2 * Math.random();
    this.speed = 
    this.tier = tier;


    function sizeByTier() {
        switch (tier) {
            case 3:
                return generateRandomNumber(25, 40);
                break;
            case 2:
                return generateRandomNumber(15, 25);
                break;
            case 1:
                return generateRandomNumber(5, 10);
                break;
        }
    }

    function generateSpeed() {
        switch (tier) {
            case 3:
                return generateRandomNumber(1, 3);
                break;
            case 2:
                return generateRandomNumber(2, 5);
                break;
            case 1:
                return generateRandomNumber(3, 6);
                break;
        }
    }

    function generateCords() {

        if (loc !== null && loc.constructor === Array) {
            return loc;
        }

        var randomNumX = generateRandomNumber(0, 1280);
        var randomNumY = generateRandomNumber(0, 680);

        while (randomNumX > 400 && randomNumX < 750) {
            randomNumX = generateRandomNumber(0, 1280);
        }

        return [randomNumX, randomNumY];

    }

    function generateRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

}

module.exports = Asteroid;