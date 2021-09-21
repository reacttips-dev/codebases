"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSMDomain = exports.getPanelSize = void 0;
function getPanelSize(_a) {
    var horizontal = _a.horizontal, vertical = _a.vertical;
    return { width: horizontal.bandwidth, height: vertical.bandwidth };
}
exports.getPanelSize = getPanelSize;
var hasSMDomain = function (_a) {
    var domain = _a.domain;
    return domain.length > 0 && domain[0] !== undefined;
};
exports.hasSMDomain = hasSMDomain;
//# sourceMappingURL=panel.js.map