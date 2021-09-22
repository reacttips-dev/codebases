import * as React from "react";
import { FeedbackTextBubbleWarning } from "../SvgIcons";
import * as styles from "./styles.css";
const SystemWideAlert = (props) => {
    const { messageTitle, messageDetails, className = "" } = props;
    const titleStyle = messageDetails ? styles.messageTitleBold : "";
    return (React.createElement("div", { className: `${styles.systemWideAlert} ${className}` },
        React.createElement("div", { className: styles.messageContent },
            React.createElement(FeedbackTextBubbleWarning, { className: styles.icon }),
            React.createElement("div", { className: styles.messageDetailsBox },
                React.createElement("p", { className: `${styles.messageTitle} ${titleStyle}` }, messageTitle),
                messageDetails && React.createElement("div", { className: styles.messageDetails }, messageDetails)))));
};
export default SystemWideAlert;
//# sourceMappingURL=SystemWideAlert.js.map