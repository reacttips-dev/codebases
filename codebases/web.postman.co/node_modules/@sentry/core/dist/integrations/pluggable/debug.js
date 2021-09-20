"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hub_1 = require("@sentry/hub");
/** JSDoc */
var Debug = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function Debug(options) {
        /**
         * @inheritDoc
         */
        this.name = Debug.id;
        this.options = tslib_1.__assign({ debugger: false, stringify: false }, options);
    }
    /**
     * @inheritDoc
     */
    Debug.prototype.setupOnce = function () {
        var _this = this;
        hub_1.addGlobalEventProcessor(function (event, hint) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var self;
            return tslib_1.__generator(this, function (_a) {
                self = hub_1.getCurrentHub().getIntegration(Debug);
                if (self) {
                    // tslint:disable:no-console
                    // tslint:disable:no-debugger
                    if (self.options.debugger) {
                        debugger;
                    }
                    if (self.options.stringify) {
                        console.log(JSON.stringify(event, null, 2));
                        if (hint) {
                            console.log(JSON.stringify(hint, null, 2));
                        }
                    }
                    else {
                        console.log(event);
                        if (hint) {
                            console.log(hint);
                        }
                    }
                }
                return [2 /*return*/, event];
            });
        }); });
    };
    /**
     * @inheritDoc
     */
    Debug.id = 'Debug';
    return Debug;
}());
exports.Debug = Debug;
//# sourceMappingURL=debug.js.map