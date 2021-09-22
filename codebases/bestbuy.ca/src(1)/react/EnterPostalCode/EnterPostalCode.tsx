import { Button, Form, Input } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import { DeliveryIcon } from "@bbyca/bbyca-components";
import * as styles from "./styles.css";
import messages from "./translations/messages";
export class EnterPostalCode extends React.Component {
    constructor() {
        super(...arguments);
        this.handleSubmit = (type, e, data) => {
            e.preventDefault();
            this.props.changePostalCode(data.postalCode.value);
        };
        this.hasPostalCodeChars = (val) => {
            const re = new RegExp("^([0-9A-Za-z\\s]*)$");
            return re.test(String(val));
        };
        this.validatePostalCode = (val) => {
            if (val.length === 3 && !this.props.validateCompletePostalCode) {
                return /^[A-Za-z]\d[A-Za-z][ ]?$/.test(val);
            }
            else {
                return /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/.test(val);
            }
        };
    }
    render() {
        const isBasic = !!this.props.basic;
        return (React.createElement("div", { className: styles.updatePostalCode },
            !isBasic &&
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "epcheader" },
                        React.createElement("div", { className: "img-col" },
                            React.createElement(DeliveryIcon, { className: "deliveryIcon" })),
                        React.createElement("div", { className: "text-col" },
                            React.createElement("h2", null, this.props.intl.formatMessage(messages.deliveryText)))),
                    React.createElement("div", { className: "epcheader-row-two" }, this.props.intl.formatMessage(messages.estimatesText)),
                    React.createElement("div", { className: "epcheader-row-three" }, this.props.intl.formatMessage(messages.changeDestinationText))),
            React.createElement(Form, { onSubmit: this.handleSubmit, onError: this.props.onError, scrollToErrors: this.props.scrollToErrors },
                React.createElement("div", { className: "update-form-div" },
                    React.createElement("div", { className: "update-txt-div" },
                        React.createElement(Input, { asyncValidators: [this.hasPostalCodeChars], className: "uppercase", error: this.props.error, errorMsg: this.props.intl.formatMessage(messages.invalidPostalCodeText), formatter: "*** ***", name: "postalCode", validators: [this.validatePostalCode], value: this.props.postalCode, handleSyncChange: this.props.handleAsyncChange, handleAsyncChange: this.props.handleSyncChange })),
                    React.createElement("div", { className: "update-btn-div" },
                        React.createElement(Button, { type: "submit", appearance: "tertiary" }, this.props.intl.formatMessage(messages.updateBtnLabel)))))));
    }
}
export default injectIntl(EnterPostalCode);
//# sourceMappingURL=EnterPostalCode.js.map