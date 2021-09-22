import * as React from "react";
import { Menu } from "../../../SvgIcons/Menu";
import * as styles from "./styles.css";
const InPageNav = ({ title = "", onClick }) => {
    return (React.createElement("div", { className: styles.inPageNav },
        React.createElement("div", { className: styles.inPageNavContentButton, onClick: onClick },
            React.createElement(Menu, { className: styles.inPageNavIcon }),
            React.createElement("span", { className: styles.inPageNavText }, title))));
};
export default InPageNav;
//# sourceMappingURL=InPageNav.js.map