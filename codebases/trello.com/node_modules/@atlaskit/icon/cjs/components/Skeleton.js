"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var styled_components_1 = tslib_1.__importDefault(require("styled-components"));
var constants_1 = require("../constants");
var Skeleton = styled_components_1.default.div(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n  width: ", ";\n  height: ", ";\n  display: inline-block;\n  border-radius: 50%;\n  background-color: ", ";\n  opacity: ", ";\n"], ["\n  width: ", ";\n  height: ", ";\n  display: inline-block;\n  border-radius: 50%;\n  background-color: ", ";\n  opacity: ", ";\n"])), function (props) { return constants_1.sizes[props.size || 'medium']; }, function (props) { return constants_1.sizes[props.size || 'medium']; }, function (_a) {
    var color = _a.color;
    return color;
}, function (_a) {
    var weight = _a.weight;
    return (weight === 'strong' ? 0.3 : 0.15);
});
Skeleton.defaultProps = {
    size: 'medium',
    weight: 'normal',
    color: 'currentColor',
};
exports.default = Skeleton;
var templateObject_1;
//# sourceMappingURL=Skeleton.js.map