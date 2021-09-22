import { Button, Form, GlobalErrorMessage, GlobalSuccessMessage, Loader, required, Select, TextArea, } from "@bbyca/bbyca-components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { MessageType } from "../../../redux/providers/CommunicationProvider/requests/SendMessageRequest";
import * as styles from "./styles.css";
import messages from "./translations/messages";
export const topics = {
    delivery: messages.topic_delivery,
    orderStatus: messages.topic_orderStatus,
    other: messages.topic_other,
    priceMatch: messages.topic_priceMatch,
    product: messages.topic_product,
    requestReceipt: messages.topic_requestReceipt,
    returns: messages.topic_returns,
};
export var Status;
(function (Status) {
    Status[Status["pending"] = 0] = "pending";
    Status[Status["sending"] = 1] = "sending";
    Status[Status["sent"] = 2] = "sent";
    Status[Status["error"] = 3] = "error";
})(Status || (Status = {}));
const StatusMessage = ({ type, intl, successMessageProps }) => {
    switch (type) {
        case (Status.error):
            return (React.createElement(GlobalErrorMessage, { message: intl.formatMessage(messages.errorHeader) }));
        case (Status.sent):
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: styles.successMessageHeader },
                    React.createElement(GlobalSuccessMessage, { message: successMessageProps.successHeader })),
                React.createElement("p", { className: styles.successMessageBody }, successMessageProps.successBody)));
        default:
            return null;
    }
};
export const OrderCommunicationFormView = ({ status, onCancel, onSubmit, onSelectTopic, className, topic, successMessageProps, intl }) => {
    const messageSent = status === Status.error || status === Status.sent;
    const { formatMessage } = intl;
    return (React.createElement("div", { className: className },
        React.createElement(Loader, { loading: !messageSent, resizeWhenLoading: true },
            React.createElement("div", { className: styles.errorMsg },
                React.createElement(StatusMessage, { type: status, intl: intl, successMessageProps: successMessageProps }))),
        React.createElement(Loader, { loading: status === Status.sent, resizeWhenLoading: true },
            React.createElement(Form, { onSubmit: onSubmit },
                React.createElement("fieldset", null,
                    !topic &&
                        React.createElement(Select, { name: "topic", handleSyncChange: onSelectTopic, label: intl.formatMessage(messages.selectLabel), errorMsg: intl.formatMessage(messages.meassageSelectError), controllable: true, validators: [required] },
                            React.createElement("option", { value: "" }, intl.formatMessage(messages.pleaseSelect)),
                            React.createElement("option", { value: "product" }, intl.formatMessage(topics.product)),
                            React.createElement("option", { value: "other" }, intl.formatMessage(topics.other)),
                            React.createElement("option", { value: "orderStatus" }, intl.formatMessage(topics.orderStatus)),
                            React.createElement("option", { value: "requestReceipt" }, intl.formatMessage(topics.requestReceipt)),
                            React.createElement("option", { value: "delivery" }, intl.formatMessage(topics.delivery))),
                    React.createElement("label", { htmlFor: "content", className: "contentLabel" }, getTextAreaLabel(topic)),
                    React.createElement(TextArea, { name: "content", rows: 10, validators: [required], errorMsg: formatMessage(messages.messageError) })),
                React.createElement("div", { className: styles.buttons },
                    onCancel &&
                        React.createElement(Button, { isDisabled: status === Status.sending, appearance: "transparent", type: "button", onClick: onCancel, className: styles.cancelButton }, formatMessage(messages.cancelBtn)),
                    React.createElement(Button, { isDisabled: status === Status.sending, appearance: "secondary", type: "submit" }, formatMessage(getSubmitButtonTextMsgKey(topic))))))));
};
function getTextAreaLabel(topic) {
    if (!topic) {
        return React.createElement(FormattedMessage, { id: messages.messageHeader.id });
    }
    else if (topic === "priceMatch") {
        return renderTextAreaLabelForPriceMatch();
    }
    else if (topic === "returns") {
        return renderTextAreaLabelForReturns();
    }
    else {
        return React.createElement(FormattedMessage, { id: messages.messageHeader.id });
    }
}
const renderTextAreaLabelForPriceMatch = () => {
    return (React.createElement("div", { className: "textAreaHeader" },
        React.createElement(FormattedMessage, { id: messages.messageHeader_bbycPriceMatch_title.id }),
        React.createElement("ul", null,
            React.createElement("li", null,
                React.createElement(FormattedMessage, { id: messages.messageHeader_bbycPriceMatch_itemOne.id })),
            React.createElement("li", null,
                React.createElement(FormattedMessage, { id: messages.messageHeader_bbycPriceMatch_itemTwo.id })),
            React.createElement("li", null,
                React.createElement(FormattedMessage, { id: messages.messageHeader_bbycPriceMatch_itemThree.id })))));
};
const renderTextAreaLabelForReturns = () => {
    return (React.createElement("div", { className: "textAreaHeader" },
        React.createElement(FormattedMessage, { id: messages.messageHeader_bbycReturns_title.id }),
        React.createElement("ul", null,
            React.createElement("li", null,
                React.createElement(FormattedMessage, { id: messages.messageHeader_bbycReturns_itemOne.id })))));
};
function getSubmitButtonTextMsgKey(topic) {
    if (!topic) {
        return messages.submitBtn;
    }
    else if (topic === "priceMatch") {
        return messages.submitBtn_priceMatch;
    }
    else if (topic === "returns") {
        return messages.submitBtn_returns;
    }
    else {
        return messages.submitBtn;
    }
}
const View = injectIntl(OrderCommunicationFormView);
export class OrderCommunicationFormContainer extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = (type, e, data) => {
            e.preventDefault();
            const selectedTopic = this.props.topic ? this.props.topic : this.state.selectedTopic;
            if (selectedTopic) {
                if (this.state.status === Status.sending) {
                    return;
                }
                this.setState({ status: Status.sending });
                const { communicationProvider } = this.props;
                const { content } = data;
                return communicationProvider.sendOrderMessage(this.props.orderNumber, this.props.poNumber, this.props.locale, {
                    content: content.value,
                    context: { sellerId: this.props.sellerId },
                    escalate: false,
                    sender: Object.assign({}, this.props.sender),
                    topic: this.props.intl.formatMessage(topics[selectedTopic]),
                    type: this.getTopicType(topics[selectedTopic]),
                })
                    .then(this.onPostSuccess)
                    .catch(this.onPostError);
            }
        };
        this.getTopicType = (topic) => {
            switch (topic) {
                case messages.topic_returns:
                    return MessageType.return;
                case messages.topic_priceMatch:
                    return MessageType.priceMatch;
                default:
                    return MessageType.other;
            }
        };
        this.onPostError = (error) => {
            if (this.props.onError) {
                this.props.onError(error);
            }
            this.setState({ status: Status.error });
        };
        this.onPostSuccess = () => {
            if (this.props.onSuccess) {
                this.props.onSuccess();
            }
            this.setState({ status: Status.sent });
        };
        this.handleTopicSelectChange = (id, val) => {
            this.setState({ selectedTopic: val });
        };
        this.state = {
            status: Status.pending,
        };
    }
    render() {
        return (React.createElement(View, Object.assign({}, this.props, this.state, { onCancel: this.props.onCancel, onSubmit: this.handleSubmit, onSelectTopic: this.handleTopicSelectChange })));
    }
}
export default injectIntl(OrderCommunicationFormContainer);
//# sourceMappingURL=OrderCommunicationsForm.js.map