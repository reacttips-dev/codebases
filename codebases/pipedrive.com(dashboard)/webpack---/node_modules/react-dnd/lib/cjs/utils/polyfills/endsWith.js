"use strict";
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, thisLen) {
        if (thisLen === undefined || thisLen > this.length) {
            thisLen = this.length;
        }
        return this.substring(thisLen - search.length, thisLen) === search;
    };
}
