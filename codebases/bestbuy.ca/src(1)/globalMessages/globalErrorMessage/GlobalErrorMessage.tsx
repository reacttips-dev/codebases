import * as React from "react";
import * as styles from "./styles.css";
class GlobalErrorMessage extends React.Component {
    render() {
        const { message, messages, children } = this.props;
        const hasMessages = messages && messages.length > 0;
        const hasChildren = typeof children !== "undefined";
        const messageStyle = hasMessages || hasChildren ? styles.message : "";
        return (React.createElement("div", { className: styles.globalMessageContainer },
            React.createElement("span", { className: styles.iconContainer, role: "img", "aria-label": "error" }),
            React.createElement("div", { className: styles.contentContainer },
                message && React.createElement("p", { className: messageStyle }, message),
                messages && messages.map((msg, i) => React.createElement("p", { key: i }, msg)),
                children)));
    }
}
export default GlobalErrorMessage;
//# sourceMappingURL=GlobalErrorMessage.js.map