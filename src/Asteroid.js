var Asteroid = function asteroid() {

    this.loc = generateCords();
    this.size = Math.random() * (20 - 5) + 5;
    this.dir = Math.PI * 2 * Math.random();

    function generateCords() {

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