"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("@sentry/utils/logger");
/**
 * @deprecated
 * This file can be safely removed in the next major bump
 */
/** Adds SDK info to an event. */
var SDKInformation = /** @class */ (function () {
    function SDKInformation() {
        /**
         * @inheritDoc
         */
        this.name = 'SDKInformation';
    }
    /**
     * @inheritDoc
     */
    SDKInformation.prototype.setupOnce = function () {
        logger_1.logger.warn("SDKInformation Integration is deprecated and can be safely removed. It's functionality has been merged into the SDK's core.");
    };
    return SDKInformation;
}());
exports.SDKInformation = SDKInformation;
//# sourceMappingURL=sdkinformation.js.map