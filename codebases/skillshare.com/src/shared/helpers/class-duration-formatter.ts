export var getClassDuration = function (seconds) {
    var hours = Math.floor(seconds / 3600);
    var secondsMutated = seconds % 3600;
    var minutes = Math.floor(secondsMutated / 60);
    var hoursString = hours > 0 ? hours + "h" : '';
    return hoursString + " " + minutes + "m";
};
//# sourceMappingURL=class-duration-formatter.js.map