import { __assign, __extends } from "tslib";
import React from 'react';
import memoizeOne from 'memoize-one';
import { Popper as ReactPopper, } from 'react-popper';
export { Manager, Reference } from 'react-popper';
var FlipBehavior = {
    auto: [],
    top: ['top', 'bottom', 'top'],
    right: ['right', 'left', 'right'],
    bottom: ['bottom', 'top', 'bottom'],
    left: ['left', 'right', 'left'],
};
var getFlipBehavior = function (side) { return FlipBehavior[side]; };
var Popper = /** @class */ (function (_super) {
    __extends(Popper, _super);
    function Popper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getModifiers = memoizeOne(function (placement) {
            var flipBehavior = getFlipBehavior(placement.split('-')[0]);
            var modifiers = {
                flip: {
                    enabled: true,
                    behavior: flipBehavior,
                    boundariesElement: 'viewport',
                },
                hide: {
                    enabled: true,
                },
                offset: {
                    enabled: true,
                    offset: _this.props.offset,
                },
                preventOverflow: {
                    enabled: true,
                    escapeWithReference: false,
                    boundariesElement: 'window',
                },
            };
            if (_this.props.modifiers) {
                return __assign(__assign({}, modifiers), _this.props.modifiers);
            }
            return modifiers;
        });
        return _this;
    }
    Popper.prototype.render = function () {
        var _a = this.props, placement = _a.placement, children = _a.children, referenceElement = _a.referenceElement;
        var modifiers = this.getModifiers(this.props.placement);
        return (React.createElement(ReactPopper, __assign({ positionFixed: true, modifiers: modifiers, placement: placement }, (referenceElement ? { referenceElement: referenceElement } : {})), children));
    };
    Popper.defaultProps = {
        children: function () { return null; },
        offset: '0, 8px',
        placement: 'bottom-start',
    };
    return Popper;
}(React.Component));
export { Popper };
//# sourceMappingURL=Popper.js.map