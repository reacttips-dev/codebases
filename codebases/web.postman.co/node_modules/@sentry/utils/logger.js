"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var misc_1 = require("./misc");
// TODO: Implement different loggers for different environments
var global = misc_1.getGlobalObject();
/** JSDoc */
var Logger = /** @class */ (function () {
    /** JSDoc */
    function Logger() {
        this.enabled = false;
    }
    /** JSDoc */
    Logger.prototype.disable = function () {
        this.enabled = false;
    };
    /** JSDoc */
    Logger.prototype.enable = function () {
        this.enabled = true;
    };
    /** JSDoc */
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.enabled) {
            return;
        }
        misc_1.consoleSandbox(function () {
            global.console.log("Sentry Logger [Log]: " + args.join(' ')); // tslint:disable-line:no-console
        });
    };
    /** JSDoc */
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.enabled) {
            return;
        }
        misc_1.consoleSandbox(function () {
            global.console.warn("Sentry Logger [Warn]: " + args.join(' ')); // tslint:disable-line:no-console
        });
    };
    /** JSDoc */
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.enabled) {
            return;
        }
        misc_1.consoleSandbox(function () {
            global.console.error("Sentry Logger [Error]: " + args.join(' ')); // tslint:disable-line:no-console
        });
    };
    return Logger;
}());
var logger = new Logger();
exports.logger = logger;
//# sourceMappingURL=logger.js.map