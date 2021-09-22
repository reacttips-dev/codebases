import { Badge } from "@bbyca/bbyca-components";
import * as React from "react";
export const BadgeWrapper = ({ sku, locale, promotionalBadges, className, display = false }) => {
    let shouldShowBadge = Boolean(promotionalBadges &&
        promotionalBadges[sku] &&
        promotionalBadges[sku].type);
    if (shouldShowBadge && promotionalBadges[sku].applyConditions) {
        shouldShowBadge = shouldShowBadge && display;
    }
    return shouldShowBadge ?
        React.createElement(Badge, { className: className, locale: locale, type: promotionalBadges[sku].type })
        : null;
};
export default BadgeWrapper;
//# sourceMappingURL=BadgeWrapper.js.map