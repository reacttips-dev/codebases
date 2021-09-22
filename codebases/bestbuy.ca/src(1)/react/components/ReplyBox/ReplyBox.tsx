import { Button, Form, required, TextArea, } from "@bbyca/bbyca-components";
import { GlobalErrorMessage } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import { MessageStatus } from "../../../utils/OrderMessageHistoryHelpers/orderMessageHistoryEnums";
import { replyBoxformItemName } from "./";
import * as styles from "./style.css";
import messages from "./translations/messages";
export const ReplyBox = ({ children, globalErrorMessage, intl: { formatMessage, }, messageStatus, onSubmit, placeHolderMessage, }) => {
    const inputPlaceholder = placeHolderMessage || formatMessage(Object.assign({}, messages.replyBoxInputPlaceholder));
    const globalErrorMessageText = globalErrorMessage || formatMessage(Object.assign({}, messages.replyBoxGlobalErrorMessage));
    const [inputValue, setInputValue] = React.useState("");
    const [showGlobalError, setShowGlobalError] = React.useState(messageStatus === MessageStatus.error);
    const handleSubmit = React.useCallback((type, e, data) => {
        e.preventDefault();
        onSubmit(data);
    }, [onSubmit]);
    const handleInputChange = React.useCallback((id, val) => {
        if (showGlobalError) {
            setShowGlobalError(false);
        }
        setInputValue(val);
    }, [showGlobalError]);
    React.useEffect(() => {
        setShowGlobalError(messageStatus === MessageStatus.error);
        if (messageStatus === MessageStatus.sent || messageStatus === MessageStatus.pending) {
            setInputValue("");
        }
    }, [messageStatus]);
    return (React.createElement("div", { className: styles.container },
        showGlobalError &&
            React.createElement(GlobalErrorMessage, { message: globalErrorMessageText }),
        React.createElement(Form, { name: replyBoxformItemName.form, onSubmit: handleSubmit },
            React.createElement("div", { className: styles.replyBoxForm },
                React.createElement(TextArea, { name: replyBoxformItemName.textarea, errorMsg: formatMessage(Object.assign({}, messages.replyBoxInputErrorMessage)), validators: [required], placeholder: inputPlaceholder, className: styles.replyInput, value: inputValue, handleSyncChange: handleInputChange, maxLength: 1000, autoComplete: "off", rows: 5 }),
                React.createElement(Button, { type: "submit", appearance: "secondary", extraAttrs: { "data-automation": "submitButton" }, className: styles.replySubmitButton }, formatMessage(Object.assign({}, messages.replyBoxButton))))),
        !!children &&
            React.createElement("div", { className: styles.replyBoxChildContainer }, children)));
};
export default injectIntl(ReplyBox);
//# sourceMappingURL=ReplyBox.js.map