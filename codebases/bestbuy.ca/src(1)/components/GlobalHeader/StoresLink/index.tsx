import { Store } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import Link from "../Link";
import * as styles from "./style.css";
import messages from "./translations/messages";
export const StoresLink = ({ onClick, className = "", showLabel, intl, }) => (React.createElement(Link, { href: intl.formatMessage(Object.assign({}, messages.storeHref)), onClick: onClick, className: `${styles.storesLink} ${className}`, extraAttributes: { "data-automation": "x-stores" }, "aria-label": intl.formatMessage(messages.storeAriaLabel), external: true },
    React.createElement(Store, { className: styles.storesIcon, color: "white", viewBox: "0 0 32 32" }),
    showLabel &&
        React.createElement("div", { className: styles.storesLabel }, intl.formatMessage(messages.storeText))));
export default injectIntl(StoresLink);
//# sourceMappingURL=index.js.map