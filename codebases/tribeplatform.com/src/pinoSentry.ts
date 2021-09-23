"use strict";
// From https://github.com/aandrewww/pino-sentry
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWriteStreamAsync = exports.createWriteStream = exports.PinoSentryTransport = void 0;
var Sentry = __importStar(require("@sentry/node"));
var pumpify_1 = __importDefault(require("pumpify"));
var split2_1 = __importDefault(require("split2"));
var through2_1 = __importDefault(require("through2"));
var config_1 = require("./utils/config");
var ExtendedError = /** @class */ (function (_super) {
    __extends(ExtendedError, _super);
    function ExtendedError(info) {
        var _this = _super.call(this, info.message) || this;
        _this.name = 'Error';
        _this.stack = info.stack || null;
        return _this;
    }
    return ExtendedError;
}(Error));
var SEVERITIES_MAP = {
    10: Sentry.Severity.Debug,
    20: Sentry.Severity.Debug,
    30: Sentry.Severity.Info,
    40: Sentry.Severity.Warning,
    50: Sentry.Severity.Error,
    60: Sentry.Severity.Fatal,
    // Support for useLevelLabels
    // https://github.com/pinojs/pino/blob/master/docs/api.md#uselevellabels-boolean
    trace: Sentry.Severity.Debug,
    debug: Sentry.Severity.Debug,
    info: Sentry.Severity.Info,
    warning: Sentry.Severity.Warning,
    error: Sentry.Severity.Error,
    fatal: Sentry.Severity.Fatal,
};
// How severe the Severity is
var SeverityIota = (_a = {},
    _a[Sentry.Severity.Debug] = 1,
    _a[Sentry.Severity.Log] = 2,
    _a[Sentry.Severity.Info] = 3,
    _a[Sentry.Severity.Warning] = 4,
    _a[Sentry.Severity.Error] = 5,
    _a[Sentry.Severity.Fatal] = 6,
    _a[Sentry.Severity.Critical] = 7,
    _a);
var PinoSentryTransport = /** @class */ (function () {
    function PinoSentryTransport(options) {
        // Default minimum log level to `debug`
        this.minimumLogLevel = SeverityIota[Sentry.Severity.Debug];
        this.messageAttributeKey = 'msg';
        this.extraAttributeKeys = ['extra'];
        this.stackAttributeKey = 'stack';
        Sentry.init(this.validateOptions(options || {}));
    }
    PinoSentryTransport.prototype.getLogSeverity = function (level) {
        return SEVERITIES_MAP[level] || Sentry.Severity.Info;
    };
    Object.defineProperty(PinoSentryTransport.prototype, "sentry", {
        get: function () {
            return Sentry;
        },
        enumerable: false,
        configurable: true
    });
    PinoSentryTransport.prototype.transformer = function () {
        var _this = this;
        return through2_1.default.obj(function (chunk, _enc, cb) {
            _this.prepareAndGo(chunk, cb);
        });
    };
    PinoSentryTransport.prototype.prepareAndGo = function (chunk, cb) {
        var _this = this;
        var severity = this.getLogSeverity(chunk.level);
        // Check if we send this Severity to Sentry
        if (this.shouldLog(severity) === false) {
            setImmediate(cb);
            return;
        }
        var level = chunk.level, _a = chunk.tags, tags = _a === void 0 ? {} : _a, responseTime = chunk.responseTime, msg = chunk.msg, time = chunk.time, pid = chunk.pid, hostname = chunk.hostname, rest = __rest(chunk, ["level", "tags", "responseTime", "msg", "time", "pid", "hostname"]);
        if (chunk.reqId) {
            tags.uuid = chunk.reqId;
        }
        if (chunk.responseTime) {
            tags.responseTime = chunk.responseTime;
        }
        if (chunk.hostname) {
            tags.hostname = chunk.hostname;
        }
        var extra = rest;
        var message = chunk[this.messageAttributeKey];
        var stack = chunk[this.stackAttributeKey] || '';
        Sentry.configureScope(function (scope) {
            if (_this.isObject(tags)) {
                Object.keys(tags).forEach(function (tag) { return scope.setTag(tag, tags[tag]); });
            }
            if (_this.isObject(extra)) {
                Object.keys(extra).forEach(function (ext) { return scope.setExtra(ext, extra[ext]); });
            }
        });
        // Capturing Errors / Exceptions
        if (this.isSentryException(severity)) {
            var error_1 = message instanceof Error
                ? message
                : new ExtendedError({ message: message, stack: stack });
            setImmediate(function () {
                Sentry.captureException(error_1);
                cb();
            });
        }
        else {
            // Capturing Messages
            setImmediate(function () {
                Sentry.captureMessage(message, severity);
                cb();
            });
        }
    };
    PinoSentryTransport.prototype.validateOptions = function (options) {
        var _a, _b, _c;
        var dsn = options.dsn || config_1.getRuntimeConfigVariable('SHARED_SENTRY_DSN');
        if (!dsn) {
            console.log('Warning: [pino-sentry] Sentry DSN must be supplied, otherwise logs will not be reported. Pass via options or `SENTRY_DSN` environment variable.');
        }
        if (options.level) {
            var allowedLevels = Object.keys(SeverityIota);
            if (allowedLevels.includes(options.level) === false) {
                throw new Error("[pino-sentry] Option `level` must be one of: " + allowedLevels.join(', ') + ". Received: " + options.level);
            }
            // Set minimum log level
            this.minimumLogLevel = SeverityIota[options.level];
        }
        this.stackAttributeKey = (_a = options.stackAttributeKey) !== null && _a !== void 0 ? _a : this.stackAttributeKey;
        this.extraAttributeKeys =
            (_b = options.extraAttributeKeys) !== null && _b !== void 0 ? _b : this.extraAttributeKeys;
        this.messageAttributeKey =
            (_c = options.messageAttributeKey) !== null && _c !== void 0 ? _c : this.messageAttributeKey;
        return __assign({ dsn: dsn, 
            // npm_package_name will be available if ran with
            // from a "script" field in package.json.
            serverName: process.env.npm_package_name || 'pino-sentry', environment: config_1.getRuntimeConfigVariable('SHARED_SENTRY_ENVIRONMENT') ||
                process.env.NODE_ENV ||
                'production', debug: !!config_1.getRuntimeConfigVariable('SHARED_SENTRY_DEBUG') || false, sampleRate: 1.0, maxBreadcrumbs: 100 }, options);
    };
    PinoSentryTransport.prototype.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || (type === 'object' && !!obj);
    };
    PinoSentryTransport.prototype.isSentryException = function (level) {
        return level === Sentry.Severity.Fatal || level === Sentry.Severity.Error;
    };
    PinoSentryTransport.prototype.shouldLog = function (severity) {
        var logLevel = SeverityIota[severity];
        return logLevel >= this.minimumLogLevel;
    };
    return PinoSentryTransport;
}());
exports.PinoSentryTransport = PinoSentryTransport;
function createWriteStream(options) {
    var transport = new PinoSentryTransport(options);
    var sentryTransformer = transport.transformer();
    return new pumpify_1.default(split2_1.default(function (line) {
        try {
            if (typeof window === "undefined") {
                console.log(line);
            }
            return JSON.parse(line);
        }
        catch (e) {
            // Returning undefined will not run the sentryTransformer
        }
    }), sentryTransformer);
}
exports.createWriteStream = createWriteStream;
// Duplicate to not break API
exports.createWriteStreamAsync = createWriteStream;
//# sourceMappingURL=pinoSentry.js.map