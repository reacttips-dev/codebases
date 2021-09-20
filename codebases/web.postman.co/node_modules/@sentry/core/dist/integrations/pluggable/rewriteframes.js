"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hub_1 = require("@sentry/hub");
var path_1 = require("@sentry/utils/path");
/** Rewrite event frames paths */
var RewriteFrames = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function RewriteFrames(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        /**
         * @inheritDoc
         */
        this.name = RewriteFrames.id;
        /**
         * @inheritDoc
         */
        this.iteratee = function (frame) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var base;
            return tslib_1.__generator(this, function (_a) {
                if (frame.filename && frame.filename.startsWith('/')) {
                    base = this.root ? path_1.relative(this.root, frame.filename) : path_1.basename(frame.filename);
                    frame.filename = "app:///" + base;
                }
                return [2 /*return*/, frame];
            });
        }); };
        if (options.root) {
            this.root = options.root;
        }
        if (options.iteratee) {
            this.iteratee = options.iteratee;
        }
    }
    /**
     * @inheritDoc
     */
    RewriteFrames.prototype.setupOnce = function () {
        var _this = this;
        hub_1.addGlobalEventProcessor(function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var self;
            return tslib_1.__generator(this, function (_a) {
                self = hub_1.getCurrentHub().getIntegration(RewriteFrames);
                if (self) {
                    return [2 /*return*/, self.process(event)];
                }
                return [2 /*return*/, event];
            });
        }); });
    };
    /** JSDoc */
    RewriteFrames.prototype.process = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var frames, _a, _b, _i, i, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        frames = this.getFramesFromEvent(event);
                        if (!frames) return [3 /*break*/, 4];
                        _a = [];
                        for (_b in frames)
                            _a.push(_b);
                        _i = 0;
                        _e.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        i = _a[_i];
                        // tslint:disable-next-line
                        _c = frames;
                        _d = i;
                        return [4 /*yield*/, this.iteratee(frames[i])];
                    case 2:
                        // tslint:disable-next-line
                        _c[_d] = _e.sent();
                        _e.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, event];
                }
            });
        });
    };
    /** JSDoc */
    RewriteFrames.prototype.getFramesFromEvent = function (event) {
        var exception = event.exception;
        if (exception) {
            try {
                // tslint:disable-next-line:no-unsafe-any
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
    /**
     * @inheritDoc
     */
    RewriteFrames.id = 'RewriteFrames';
    return RewriteFrames;
}());
exports.RewriteFrames = RewriteFrames;
//# sourceMappingURL=rewriteframes.js.map