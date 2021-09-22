"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var makeId = function (length) {
    if (length === void 0) { length = 16; }
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.default = makeId;
//# sourceMappingURL=makeId.js.map