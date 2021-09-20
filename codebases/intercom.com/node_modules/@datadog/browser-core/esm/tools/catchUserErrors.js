import { display } from './display';
export function catchUserErrors(fn, errorMsg) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            return fn.apply(void 0, args);
        }
        catch (err) {
            display.error(errorMsg, err);
        }
    };
}
//# sourceMappingURL=catchUserErrors.js.map