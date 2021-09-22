import * as React from "react";
import { injectIntl } from "react-intl";
import messages from "../translations/messages";
const itemCount = ({ intl, quantity }) => {
    return (React.createElement("small", null, intl.formatMessage(messages.items, { quantity })));
};
export const ItemCount = injectIntl(itemCount);
//# sourceMappingURL=ItemCount.js.map