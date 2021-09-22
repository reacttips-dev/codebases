import React from 'react';
import { EncoreLiveBadge } from './EncoreLiveBadge';
import { InnerLiveBadge } from './InnerLiveBadge';
import { TimeLiveBadge } from './TimeLiveBadge';
export var LiveBadgeVariant;
(function (LiveBadgeVariant) {
    LiveBadgeVariant["Default"] = "default";
    LiveBadgeVariant["Encore"] = "encore";
    LiveBadgeVariant["Time"] = "time";
})(LiveBadgeVariant || (LiveBadgeVariant = {}));
export function LiveBadge(props) {
    var _a = props.variant, variant = _a === void 0 ? 'default' : _a, startDate = props.startDate, endDate = props.endDate;
    switch (variant) {
        case 'encore':
            return React.createElement(EncoreLiveBadge, null);
        case 'time':
            return React.createElement(TimeLiveBadge, { startDate: startDate, endDate: endDate });
        default:
            return (React.createElement("div", { className: "live-badge" },
                React.createElement(InnerLiveBadge, null)));
    }
}
//# sourceMappingURL=LiveBadge.js.map