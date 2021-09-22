"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class to fetch AB tests from Split.IO and to send tracking data.
 * It's meant to be used with a Split.IO service
 */
var SplitIOABTestProvider = /** @class */ (function () {
    function SplitIOABTestProvider(service, featureToggles, logger) {
        if (featureToggles === void 0) { featureToggles = []; }
        if (logger === void 0) { logger = console.log; }
        this.featureToggles = featureToggles;
        this.logger = logger;
        this.service = service;
    }
    SplitIOABTestProvider.prototype.fetchFeatureToggles = function (attributes) {
        var _this = this;
        return this.handleFetchError(function () {
            return _this.service.fetchFeatureToggles(_this.featureToggles, attributes);
        });
    };
    SplitIOABTestProvider.prototype.fetchFeatureToggle = function (featureName, attributes) {
        var _this = this;
        return this.handleFetchError(function () {
            return _this.service.fetchFeatureToggles([featureName], attributes);
        });
    };
    SplitIOABTestProvider.prototype.getFeatureTogglesNames = function () {
        return this.featureToggles;
    };
    /**
     * Sends event details to Split.IO for tracking
     * @param eventType name of the event to track
     * @param value event value
     * @param properties event metadata
     */
    SplitIOABTestProvider.prototype.track = function (eventType, value, properties) {
        try {
            this.service.track(eventType, value, properties);
        }
        catch (error) {
            this.logger(error);
        }
    };
    SplitIOABTestProvider.prototype.handleFetchError = function (fn) {
        try {
            return fn();
        }
        catch (error) {
            this.logger(error);
            return Promise.resolve({});
        }
    };
    return SplitIOABTestProvider;
}());
exports.default = SplitIOABTestProvider;
//# sourceMappingURL=index.js.map