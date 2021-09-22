import * as React from "react";
import { injectIntl } from "react-intl";
import messages from "./translations/messages";
export const Status = ({ intl, shippingStatus }) => {
    const message = shippingStatus && messages[shippingStatus];
    if (!message) {
        return null;
    }
    return (React.createElement("div", { className: "status" },
        React.createElement("div", { className: "status-message" }, intl.formatMessage(message))));
};
export default injectIntl(Status);
//# sourceMappingURL=Status.js.map