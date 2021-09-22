import { Button, Menu } from "@bbyca/bbyca-components";
import * as React from "react";
import * as styles from "./style.css";
export const DrawerMenuButton = (props) => (React.createElement(Button, { size: "small", appearance: "secondary", className: `${styles.button}`, extraAttrs: { "data-automation": "x-navigation-menu-button" }, onClick: props.onClick, "aria-label": props.label },
    React.createElement("div", { className: styles.drawerMenuLabel }, props.label),
    React.createElement(Menu, { className: styles.drawerMenuIcon, color: "white", viewBox: "4 4 24 24" })));
//# sourceMappingURL=index.js.map