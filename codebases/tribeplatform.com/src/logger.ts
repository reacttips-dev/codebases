"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.suppressAppLevelWarnings = exports.isProductionMode = exports.productionEnvironments = void 0;
var Sentry = __importStar(require("@sentry/node"));
var pino_1 = __importDefault(require("pino"));
var pinoSentry_1 = require("./pinoSentry");
var config_1 = require("./utils/config");
exports.productionEnvironments = ['production', 'staging'];
exports.isProductionMode = exports.productionEnvironments.includes(String(process.env.NODE_ENV));
var stream = exports.isProductionMode
    ? pinoSentry_1.createWriteStream({
        dsn: config_1.getRuntimeConfigVariable('SHARED_SENTRY_DSN'),
        level: Sentry.Severity.Error,
    })
    : undefined;
var options = {
    level: 'info',
    prettyPrint: exports.isProductionMode
        ? false
        : {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    // Pino expects a binding object to be the first parameter with an optional string message as the second parameter.
    // Using this hook the parameters can be flipped:
    hooks: {
        logMethod: function (inputArgs, method) {
            if (inputArgs.length >= 2) {
                var arg1 = inputArgs.shift();
                var arg2 = inputArgs.shift();
                return method.apply(this, __spreadArray([arg2, arg1], inputArgs));
            }
            return method.apply(this, inputArgs);
        },
    },
};
var suppressAppLevelWarnings = function () {
    suppressConsoleMessage('useLayoutEffect does nothing on the server', 'error');
};
exports.suppressAppLevelWarnings = suppressAppLevelWarnings;
/*
 * @description Suppresses specific messages from being logged in the Console.
 *
 * @param {string} message - The target message to suppress, either full text, partial text or a regular expression pattern and case-insensitive.
 * @param {string} method - The Console method of the message to suppress, including "error", "info", "log" and "warn".
 * @public
 * @function
 *
 * @example
 *
 *      suppressConsoleMessage("overeager alarm system", "error");
 *
 *      console.error("An alarm system for a nuclear power plant")  // <-- Logged
 *      console.error("An overeager alarm system for React")        // <-- Not Logged
 *      console.log("An overeager alarm system for React")          // <-- Logged
 *
 */
var suppressConsoleMessage = function (message, method) {
    // eslint-disable-next-line no-console
    var nativeConsoleMethod = console[method];
    // eslint-disable-next-line no-console
    console[method] = function (nativeMessage) {
        if (!RegExp(message, 'gi').test(nativeMessage)) {
            nativeConsoleMethod(nativeMessage);
        }
    };
};
exports.logger = pino_1.default(options, stream);
//# sourceMappingURL=logger.js.map