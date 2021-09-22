import { Button, ScrollStyle } from "@bbyca/bbyca-components";
import AlertIcon from "@material-ui/icons/Error";
import * as React from "react";
import { injectIntl } from "react-intl";
import { CartStatus } from "../../../../business-rules/entities/index";
import Toaster from "../Toaster/index";
import { ErrorMappings } from "./ErrorCode";
import * as styles from "./styles.css";
import messages from "./translations/messages";
export class Confirmation extends React.Component {
    constructor() {
        super(...arguments);
        this.viewCart = () => {
            this.props.onClose();
            this.props.onViewCart();
        };
        this.showError = () => {
            const idsMapping = ErrorMappings.get(this.props.apiStatusCode);
            const defaultErrorMapping = {
                subject: messages.addToCartConfirmationFailure,
                text: messages.addToCartConfirmationFailureSubText,
            };
            const ids = idsMapping ? idsMapping : defaultErrorMapping;
            return (React.createElement("div", null,
                React.createElement("h1", null,
                    React.createElement(AlertIcon, { nativeColor: "errorTextColour" }),
                    this.props.intl.formatMessage(ids.subject)),
                React.createElement("p", null,
                    " ",
                    this.props.intl.formatMessage(ids.text))));
        };
    }
    render() {
        const { intl: { formatMessage }, onClose, show, status } = this.props;
        const statusClass = status === CartStatus.FAILED ? "failed" : "success";
        return (React.createElement("div", { className: styles.confirmation },
            React.createElement(ScrollStyle, { targetSelector: "#cartIcon", activeClassName: "fixed" },
                React.createElement(Toaster, { visible: show, onClose: onClose, className: statusClass },
                    React.createElement("div", { className: "confirmation" },
                        status === CartStatus.ADDED &&
                            React.createElement("div", null,
                                React.createElement("h1", null, formatMessage(messages.addToCartConfirmationSuccess))),
                        status === CartStatus.FAILED && this.showError(),
                        status === CartStatus.ADDED &&
                            React.createElement(Button, { className: "viewCart", onClick: this.viewCart, shouldFitContainer: true, extraAttrs: { "data-automation": "view-cart-confirmation" } }, formatMessage(messages.viewCart)))))));
    }
}
export default injectIntl(Confirmation);
//# sourceMappingURL=Confirmation.js.map