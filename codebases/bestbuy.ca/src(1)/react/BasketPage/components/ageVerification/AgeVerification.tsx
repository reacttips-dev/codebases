import { Button, Modal } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import * as styles from "./styles.css";
import messages from "./translations/messages";
export class AgeVerification extends React.Component {
    constructor(props) {
        super(props);
        this.LineItem = (props) => {
            const productData = props.sku.product;
            return (React.createElement("li", null,
                React.createElement("img", { className: "thumbnail", src: productData.thumbnailUrl }),
                React.createElement("div", { className: "product-title" }, productData.name)));
        };
    }
    render() {
        const formatMessage = this.props.intl.formatMessage;
        return (React.createElement("div", { className: styles.ageVerification },
            React.createElement(Modal, { className: "modal-container", closeLink: "javascript: void(0);", onClose: this.props.onCancel, visible: this.props.visible },
                React.createElement("header", null,
                    React.createElement("h1", null, formatMessage(messages.header))),
                React.createElement("div", { className: "body-content" },
                    React.createElement("p", null, formatMessage(messages.body)),
                    React.createElement("ul", { className: "line-items" }, this.props.lineItems.map((item) => React.createElement(this.LineItem, Object.assign({ key: item.sku.id }, item))))),
                React.createElement("div", { className: "options" },
                    React.createElement(Button, { appearance: "secondary", className: "option confirm", href: this.props.acceptLink, onClick: this.props.onAccept }, formatMessage(messages.acceptButton)),
                    React.createElement(Button, { appearance: "tertiary", onClick: this.props.onCancel, className: "option decline" }, formatMessage(messages.declineButton))))));
    }
}
export default injectIntl(AgeVerification);
//# sourceMappingURL=AgeVerification.js.map