"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hub_1 = require("@sentry/hub");
var is_1 = require("@sentry/utils/is");
var logger_1 = require("@sentry/utils/logger");
var misc_1 = require("@sentry/utils/misc");
var string_1 = require("@sentry/utils/string");
// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
var DEFAULT_IGNORE_ERRORS = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];
/** Inbound filters configurable by the user */
var InboundFilters = /** @class */ (function () {
    function InboundFilters(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        /**
         * @inheritDoc
         */
        this.name = InboundFilters.id;
    }
    /**
     * @inheritDoc
     */
    InboundFilters.prototype.setupOnce = function () {
        var _this = this;
        hub_1.addGlobalEventProcessor(function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var hub, self, client, clientOptions, options;
            return tslib_1.__generator(this, function (_a) {
                hub = hub_1.getCurrentHub();
                if (!hub) {
                    return [2 /*return*/, event];
                }
                self = hub.getIntegration(InboundFilters);
                if (self) {
                    client = hub.getClient();
                    clientOptions = client ? client.getOptions() : {};
                    options = self.mergeOptions(clientOptions);
                    if (self.shouldDropEvent(event, options)) {
                        return [2 /*return*/, null];
                    }
                }
                return [2 /*return*/, event];
            });
        }); });
    };
    /** JSDoc */
    InboundFilters.prototype.shouldDropEvent = function (event, options) {
        if (this.isSentryError(event, options)) {
            logger_1.logger.warn("Event dropped due to being internal Sentry Error.\nEvent: " + misc_1.getEventDescription(event));
            return true;
        }
        if (this.isIgnoredError(event, options)) {
            logger_1.logger.warn("Event dropped due to being matched by `ignoreErrors` option.\nEvent: " + misc_1.getEventDescription(event));
            return true;
        }
        if (this.isBlacklistedUrl(event, options)) {
            logger_1.logger.warn("Event dropped due to being matched by `blacklistUrls` option.\nEvent: " + misc_1.getEventDescription(event) + ".\nUrl: " + this.getEventFilterUrl(event));
            return true;
        }
        if (!this.isWhitelistedUrl(event, options)) {
            logger_1.logger.warn("Event dropped due to not being matched by `whitelistUrls` option.\nEvent: " + misc_1.getEventDescription(event) + ".\nUrl: " + this.getEventFilterUrl(event));
            return true;
        }
        return false;
    };
    /** JSDoc */
    InboundFilters.prototype.isSentryError = function (event, options) {
        if (options === void 0) { options = {}; }
        if (!options.ignoreInternal) {
            return false;
        }
        try {
            // tslint:disable-next-line:no-unsafe-any
            return event.exception.values[0].type === 'SentryError';
        }
        catch (_oO) {
            return false;
        }
    };
    /** JSDoc */
    InboundFilters.prototype.isIgnoredError = function (event, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (!options.ignoreErrors || !options.ignoreErrors.length) {
            return false;
        }
        return this.getPossibleEventMessages(event).some(function (message) {
            // Not sure why TypeScript complains here...
            return options.ignoreErrors.some(function (pattern) { return _this.isMatchingPattern(message, pattern); });
        });
    };
    /** JSDoc */
    InboundFilters.prototype.isBlacklistedUrl = function (event, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        // TODO: Use Glob instead?
        if (!options.blacklistUrls || !options.blacklistUrls.length) {
            return false;
        }
        var url = this.getEventFilterUrl(event);
        return !url ? false : options.blacklistUrls.some(function (pattern) { return _this.isMatchingPattern(url, pattern); });
    };
    /** JSDoc */
    InboundFilters.prototype.isWhitelistedUrl = function (event, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        // TODO: Use Glob instead?
        if (!options.whitelistUrls || !options.whitelistUrls.length) {
            return true;
        }
        var url = this.getEventFilterUrl(event);
        return !url ? true : options.whitelistUrls.some(function (pattern) { return _this.isMatchingPattern(url, pattern); });
    };
    /** JSDoc */
    InboundFilters.prototype.mergeOptions = function (clientOptions) {
        if (clientOptions === void 0) { clientOptions = {}; }
        return {
            blacklistUrls: tslib_1.__spread((this.options.blacklistUrls || []), (clientOptions.blacklistUrls || [])),
            ignoreErrors: tslib_1.__spread((this.options.ignoreErrors || []), (clientOptions.ignoreErrors || []), DEFAULT_IGNORE_ERRORS),
            ignoreInternal: typeof this.options.ignoreInternal !== 'undefined' ? this.options.ignoreInternal : true,
            whitelistUrls: tslib_1.__spread((this.options.whitelistUrls || []), (clientOptions.whitelistUrls || [])),
        };
    };
    /** JSDoc */
    InboundFilters.prototype.isMatchingPattern = function (value, pattern) {
        if (is_1.isRegExp(pattern)) {
            return pattern.test(value);
        }
        else if (typeof pattern === 'string') {
            return string_1.includes(value, pattern);
        }
        else {
            return false;
        }
    };
    /** JSDoc */
    InboundFilters.prototype.getPossibleEventMessages = function (event) {
        if (event.message) {
            return [event.message];
        }
        else if (event.exception) {
            try {
                // tslint:disable-next-line:no-unsafe-any
                var _a = event.exception.values[0], type = _a.type, value = _a.value;
                return ["" + value, type + ": " + value];
            }
            catch (oO) {
                logger_1.logger.error("Cannot extract message for event " + misc_1.getEventDescription(event));
                return [];
            }
        }
        else {
            return [];
        }
    };
    /** JSDoc */
    InboundFilters.prototype.getEventFilterUrl = function (event) {
        try {
            if (event.stacktrace) {
                // tslint:disable:no-unsafe-any
                var frames_1 = event.stacktrace.frames;
                return frames_1[frames_1.length - 1].filename;
            }
            else if (event.exception) {
                // tslint:disable:no-unsafe-any
                var frames_2 = event.exception.values[0].stacktrace.frames;
                return frames_2[frames_2.length - 1].filename;
            }
            else {
                return null;
            }
        }
        catch (oO) {
            logger_1.logger.error("Cannot extract url for event " + misc_1.getEventDescription(event));
            return null;
        }
    };
    /**
     * @inheritDoc
     */
    InboundFilters.id = 'InboundFilters';
    return InboundFilters;
}());
exports.InboundFilters = InboundFilters;
//# sourceMappingURL=inboundfilters.js.map