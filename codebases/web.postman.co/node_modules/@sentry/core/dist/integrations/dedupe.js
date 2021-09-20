"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hub_1 = require("@sentry/hub");
var logger_1 = require("@sentry/utils/logger");
var misc_1 = require("@sentry/utils/misc");
/** Deduplication filter */
var Dedupe = /** @class */ (function () {
    function Dedupe() {
        /**
         * @inheritDoc
         */
        this.name = Dedupe.id;
    }
    /**
     * @inheritDoc
     */
    Dedupe.prototype.setupOnce = function () {
        var _this = this;
        hub_1.addGlobalEventProcessor(function (currentEvent) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var self;
            return tslib_1.__generator(this, function (_a) {
                self = hub_1.getCurrentHub().getIntegration(Dedupe);
                if (self) {
                    // Juuust in case something goes wrong
                    try {
                        if (self.shouldDropEvent(currentEvent, self.previousEvent)) {
                            return [2 /*return*/, null];
                        }
                    }
                    catch (_oO) {
                        return [2 /*return*/, (self.previousEvent = currentEvent)];
                    }
                    return [2 /*return*/, (self.previousEvent = currentEvent)];
                }
                return [2 /*return*/, currentEvent];
            });
        }); });
    };
    /** JSDoc */
    Dedupe.prototype.shouldDropEvent = function (currentEvent, previousEvent) {
        if (!previousEvent) {
            return false;
        }
        if (this.isSameMessageEvent(currentEvent, previousEvent)) {
            logger_1.logger.warn("Event dropped due to being a duplicate of previous event (same message).\nEvent: " + misc_1.getEventDescription(currentEvent));
            return true;
        }
        if (this.isSameExceptionEvent(currentEvent, previousEvent)) {
            logger_1.logger.warn("Event dropped due to being a duplicate of previous event (same exception).\nEvent: " + misc_1.getEventDescription(currentEvent));
            return true;
        }
        return false;
    };
    /** JSDoc */
    Dedupe.prototype.isSameMessageEvent = function (currentEvent, previousEvent) {
        var currentMessage = currentEvent.message;
        var previousMessage = previousEvent.message;
        // If no event has a message, they were both exceptions, so bail out
        if (!currentMessage && !previousMessage) {
            return false;
        }
        // If only one event has a stacktrace, but not the other one, they are not the same
        if ((currentMessage && !previousMessage) || (!currentMessage && previousMessage)) {
            return false;
        }
        if (currentMessage !== previousMessage) {
            return false;
        }
        if (!this.isSameFingerprint(currentEvent, previousEvent)) {
            return false;
        }
        if (!this.isSameStacktrace(currentEvent, previousEvent)) {
            return false;
        }
        return true;
    };
    /** JSDoc */
    Dedupe.prototype.getFramesFromEvent = function (event) {
        var exception = event.exception;
        if (exception) {
            try {
                // @ts-ignore
                return exception.values[0].stacktrace.frames;
            }
            catch (_oO) {
                return undefined;
            }
        }
        else if (event.stacktrace) {
            return event.stacktrace.frames;
        }
        else {
            return undefined;
        }
    };
    /** JSDoc */
    Dedupe.prototype.isSameStacktrace = function (currentEvent, previousEvent) {
        var currentFrames = this.getFramesFromEvent(currentEvent);
        var previousFrames = this.getFramesFromEvent(previousEvent);
        // If no event has a fingerprint, they are assumed to be the same
        if (!currentFrames && !previousFrames) {
            return true;
        }
        // If only one event has a stacktrace, but not the other one, they are not the same
        if ((currentFrames && !previousFrames) || (!currentFrames && previousFrames)) {
            return false;
        }
        currentFrames = currentFrames;
        previousFrames = previousFrames;
        // If number of frames differ, they are not the same
        if (previousFrames.length !== currentFrames.length) {
            return false;
        }
        // Otherwise, compare the two
        for (var i = 0; i < previousFrames.length; i++) {
            var frameA = previousFrames[i];
            var frameB = currentFrames[i];
            if (frameA.filename !== frameB.filename ||
                frameA.lineno !== frameB.lineno ||
                frameA.colno !== frameB.colno ||
                frameA.function !== frameB.function) {
                return false;
            }
        }
        return true;
    };
    /** JSDoc */
    Dedupe.prototype.getExceptionFromEvent = function (event) {
        return event.exception && event.exception.values && event.exception.values[0];
    };
    /** JSDoc */
    Dedupe.prototype.isSameExceptionEvent = function (currentEvent, previousEvent) {
        var previousException = this.getExceptionFromEvent(previousEvent);
        var currentException = this.getExceptionFromEvent(currentEvent);
        if (!previousException || !currentException) {
            return false;
        }
        if (previousException.type !== currentException.type || previousException.value !== currentException.value) {
            return false;
        }
        if (!this.isSameFingerprint(currentEvent, previousEvent)) {
            return false;
        }
        if (!this.isSameStacktrace(currentEvent, previousEvent)) {
            return false;
        }
        return true;
    };
    /** JSDoc */
    Dedupe.prototype.isSameFingerprint = function (currentEvent, previousEvent) {
        var currentFingerprint = currentEvent.fingerprint;
        var previousFingerprint = previousEvent.fingerprint;
        // If no event has a fingerprint, they are assumed to be the same
        if (!currentFingerprint && !previousFingerprint) {
            return true;
        }
        // If only one event has a fingerprint, but not the other one, they are not the same
        if ((currentFingerprint && !previousFingerprint) || (!currentFingerprint && previousFingerprint)) {
            return false;
        }
        currentFingerprint = currentFingerprint;
        previousFingerprint = previousFingerprint;
        // Otherwise, compare the two
        try {
            return !!(currentFingerprint.join('') === previousFingerprint.join(''));
        }
        catch (_oO) {
            return false;
        }
    };
    /**
     * @inheritDoc
     */
    Dedupe.id = 'Dedupe';
    return Dedupe;
}());
exports.Dedupe = Dedupe;
//# sourceMappingURL=dedupe.js.map