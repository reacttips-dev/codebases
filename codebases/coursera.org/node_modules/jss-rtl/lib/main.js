"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rtl = require("rtl-css-js");
var convert = rtl['default'] || rtl;
function jssRTL(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.enabled, enabled = _c === void 0 ? true : _c, _d = _b.opt, opt = _d === void 0 ? 'out' : _d;
    return {
        onProcessStyle: function (style, rule, sheet) {
            if (rule.type === 'font-face') {
                return style;
            }
            if (!enabled) {
                if (typeof style.flip === 'boolean') {
                    delete style.flip;
                }
                return style;
            }
            var flip = opt === 'out'; // If it's set to opt-out, then it should flip by default
            if (typeof sheet.options.flip === 'boolean') {
                flip = sheet.options.flip;
            }
            if (typeof style.flip === 'boolean') {
                flip = style.flip;
                delete style.flip;
            }
            if (!flip) {
                return style;
            }
            return convert(typeof rule.toJSON === 'function' ? rule.toJSON() : style);
        },
    };
}
exports.default = jssRTL;
