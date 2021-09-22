import Observable from 'zen-observable';
import 'symbol-observable';
Observable.prototype['@@observable'] = function () { return this; };
export { Observable };
//# sourceMappingURL=Observable.js.map