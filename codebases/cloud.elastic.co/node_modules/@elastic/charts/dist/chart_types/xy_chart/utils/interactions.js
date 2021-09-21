"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrientedYPosition = exports.getOrientedXPosition = void 0;
function getOrientedXPosition(xPos, yPos, chartRotation, chartDimension) {
    switch (chartRotation) {
        case 180:
            return chartDimension.width - xPos;
        case 90:
            return yPos;
        case -90:
            return chartDimension.height - yPos;
        case 0:
        default:
            return xPos;
    }
}
exports.getOrientedXPosition = getOrientedXPosition;
function getOrientedYPosition(xPos, yPos, chartRotation, chartDimension) {
    switch (chartRotation) {
        case 180:
            return chartDimension.height - yPos;
        case -90:
            return xPos;
        case 90:
            return chartDimension.width - xPos;
        case 0:
        default:
            return yPos;
    }
}
exports.getOrientedYPosition = getOrientedYPosition;
//# sourceMappingURL=interactions.js.map