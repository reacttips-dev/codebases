"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isRef(obj) {
    return (obj !== null && typeof obj === 'object' && obj.hasOwnProperty('current'));
}
exports.isRef = isRef;
