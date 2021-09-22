import { GlobalSuccessMessage } from "@bbyca/bbyca-components";
import * as React from "react";
export default ({ items }) => {
    if (!items || items.length <= 0) {
        return null;
    }
    return (React.createElement("div", null,
        React.createElement("div", { className: "order-promo" },
            React.createElement("ol", null, items.map((item) => item.description && item.description !== ""
                ? React.createElement(GlobalSuccessMessage, { key: item.id }, item.description)
                : null)))));
};
//# sourceMappingURL=index.js.map