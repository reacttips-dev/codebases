"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Y_SCALE_DEFAULT = exports.X_SCALE_DEFAULT = void 0;
var constants_1 = require("../../../scales/constants");
exports.X_SCALE_DEFAULT = {
    type: constants_1.ScaleType.Ordinal,
    nice: false,
    desiredTickCount: 10,
};
exports.Y_SCALE_DEFAULT = {
    type: constants_1.ScaleType.Linear,
    nice: false,
    desiredTickCount: 10,
    constrainDomainPadding: undefined,
    domainPixelPadding: 0,
    logBase: undefined,
    logMinLimit: undefined,
};
//# sourceMappingURL=scale_defaults.js.map