var UUID = function () {

    this.uniqueID = 0;

    this.createUUID = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    this.getUUID = function () {
        return this.uniqueID;
    }

    this.generateUUID = function () {
        this.uniqueID = this.createUUID();
        console.log(this.uniqueID + " has been generated");
    }

}

module.exports = UUID;