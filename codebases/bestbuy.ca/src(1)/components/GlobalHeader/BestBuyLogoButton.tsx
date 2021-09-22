import { BestBuyLogoWhite } from "@bbyca/bbyca-components";
import * as React from "react";
import Link from "./Link";
import * as styles from "./style.css";
export default ({ client }) => React.createElement(Link, { to: "homepage", className: styles.logoLink, ariaLabel: "Best Buy", extraAttributes: { "data-automation": "x-logo-link" }, external: client !== "ecomm-webapp", targetSelf: client !== "ecomm-webapp" },
    React.createElement(BestBuyLogoWhite, { className: styles.logo }));
//# sourceMappingURL=BestBuyLogoButton.js.map