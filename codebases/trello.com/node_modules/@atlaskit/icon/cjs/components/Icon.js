"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var styled_components_1 = tslib_1.__importDefault(require("styled-components"));
var uuid_1 = tslib_1.__importDefault(require("uuid"));
var colors_1 = require("@atlaskit/theme/colors");
var constants_1 = require("../constants");
var getSize = function (_a) {
    var size = _a.size;
    return size ? "height: " + constants_1.sizes[size] + "; width: " + constants_1.sizes[size] + ";" : null;
};
exports.IconWrapper = styled_components_1.default.span(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n  ", ";\n  color: ", ";\n  display: inline-block;\n  fill: ", ";\n  flex-shrink: 0;\n  line-height: 1;\n\n  > svg {\n    ", ";\n    max-height: 100%;\n    max-width: 100%;\n    overflow: hidden;\n    pointer-events: none;\n    vertical-align: bottom;\n  }\n\n  /**\n   * Stop-color doesn't properly apply in chrome when the inherited/current color changes.\n   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS\n   * rule) and then override it with currentColor for the color changes to be picked up.\n   */\n  stop {\n    stop-color: currentColor;\n  }\n"], ["\n  ", ";\n  color: ", ";\n  display: inline-block;\n  fill: ", ";\n  flex-shrink: 0;\n  line-height: 1;\n\n  > svg {\n    ", ";\n    max-height: 100%;\n    max-width: 100%;\n    overflow: hidden;\n    pointer-events: none;\n    vertical-align: bottom;\n  }\n\n  /**\n   * Stop-color doesn't properly apply in chrome when the inherited/current color changes.\n   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS\n   * rule) and then override it with currentColor for the color changes to be picked up.\n   */\n  stop {\n    stop-color: currentColor;\n  }\n"])), getSize, function (p) { return p.primaryColor || 'currentColor'; }, function (p) { return p.secondaryColor || colors_1.background; }, getSize);
/**
 * Icons need unique gradient IDs across instances for different gradient definitions to work
 * correctly.
 * A step in the icon build process replaces linear gradient IDs and their references in paths
 * to a placeholder string so we can replace them with a dynamic ID here.
 * Replacing the original IDs with placeholders in the build process is more robust than not
 * using placeholders as we do not have to rely on regular expressions to find specific element
 * to replace.
 */
function insertDynamicGradientID(svgStr, label) {
    var id = uuid_1.default();
    var replacedSvgStr = svgStr
        .replace(/id="([^"]+)-idPlaceholder"/g, "id=$1-" + id)
        .replace(/fill="url\(#([^"]+)-idPlaceholder\)"/g, "fill=\"url(#$1-" + id + ")\"");
    return replacedSvgStr;
}
var Icon = function (props) {
    var Glyph = props.glyph, dangerouslySetGlyph = props.dangerouslySetGlyph, primaryColor = props.primaryColor, secondaryColor = props.secondaryColor, size = props.size, testId = props.testId, label = props.label;
    var glyphProps = dangerouslySetGlyph
        ? {
            dangerouslySetInnerHTML: {
                __html: insertDynamicGradientID(dangerouslySetGlyph, label),
            },
        }
        : { children: Glyph ? react_1.default.createElement(Glyph, { role: "presentation" }) : null };
    return (react_1.default.createElement(exports.IconWrapper, tslib_1.__assign({ primaryColor: primaryColor, secondaryColor: secondaryColor, size: size, "data-testid": testId, role: label ? 'img' : 'presentation', "aria-label": label ? label : undefined }, glyphProps)));
};
exports.default = Icon;
var templateObject_1;
//# sourceMappingURL=Icon.js.map