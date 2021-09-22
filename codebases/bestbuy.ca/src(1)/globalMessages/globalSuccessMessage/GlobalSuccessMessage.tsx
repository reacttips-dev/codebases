import * as React from "react";
import * as styles from "./styles.css";
class GlobalSuccessMessage extends React.Component {
    render() {
        const { message, children } = this.props;
        const messageStyle = children ? styles.message : "";
        return (React.createElement("div", { className: styles.globalMessageContainer },
            React.createElement("span", { className: styles.iconContainer, role: "img", "aria-label": "success" }),
            React.createElement("div", { className: styles.contentContainer },
                message && React.createElement("p", { className: messageStyle }, message),
                children)));
    }
}
export default GlobalSuccessMessage;
//# sourceMappingURL=GlobalSuccessMessage.js.map