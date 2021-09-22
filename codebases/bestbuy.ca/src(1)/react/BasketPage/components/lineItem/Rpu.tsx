import * as React from "react";
import { injectIntl } from "react-intl";
import messages from "./translations/messages";
const Rpu = (props) => {
    if (!props || !props.availability) {
        return null;
    }
    const { pickup } = props.availability;
    const isReservable = pickup
        && pickup.purchasable
        && (pickup.status !== "NotAvailable")
        && (props.isRpuEnabled === undefined || props.isRpuEnabled === true)
        && (!props.isLightweightBasketEnabled);
    if (!isReservable) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("section", { className: "RpuSection" },
            React.createElement("header", null, props.intl.formatMessage(messages.ReserveInStoreHeader)),
            React.createElement("p", null, props.intl.formatMessage(messages.ReserveInStoreDescription)),
            React.createElement("a", { className: "reserveInStoreLink", href: "javascript: void(0);", onClick: props.onReserveInStoreButtonClick }, props.intl.formatMessage(messages.ReserveInStore)))));
};
export default injectIntl(Rpu);
//# sourceMappingURL=Rpu.js.map