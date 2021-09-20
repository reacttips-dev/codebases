"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var logger_1 = require("@sentry/utils/logger");
var object_1 = require("@sentry/utils/object");
var error_1 = require("./error");
var noop_1 = require("./transports/noop");
/**
 * This is the base implemention of a Backend.
 */
var BaseBackend = /** @class */ (function () {
    /** Creates a new browser backend instance. */
    function BaseBackend(options) {
        this.options = options;
        if (!this.options.dsn) {
            logger_1.logger.warn('No DSN provided, backend will not do anything.');
        }
        this.transport = this.setupTransport();
    }
    /**
     * Sets up the transport so it can be used later to send requests.
     */
    BaseBackend.prototype.setupTransport = function () {
        return new noop_1.NoopTransport();
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.eventFromException = function (_exception, _hint) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                throw new error_1.SentryError('Backend has to implement `eventFromException` method');
            });
        });
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.eventFromMessage = function (_message, _level, _hint) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                throw new error_1.SentryError('Backend has to implement `eventFromMessage` method');
            });
        });
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.sendEvent = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                // TODO: Remove with v5
                // tslint:disable-next-line
                if (this.transport.captureEvent) {
                    // tslint:disable-next-line
                    return [2 /*return*/, this.transport.captureEvent(event)];
                }
                // --------------------
                return [2 /*return*/, this.transport.sendEvent(object_1.serialize(event))];
            });
        });
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.storeBreadcrumb = function (_) {
        return true;
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.storeScope = function (_) {
        // Noop
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.getTransport = function () {
        return this.transport;
    };
    return BaseBackend;
}());
exports.BaseBackend = BaseBackend;
//# sourceMappingURL=basebackend.js.map