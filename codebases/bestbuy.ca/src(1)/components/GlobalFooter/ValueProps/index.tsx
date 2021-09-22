import * as React from "react";
import Link from "../../GlobalHeader/Link";
import { getLinkApp } from "../utils/appMap";
import iconLinksMap from "./components/icons";
import * as styles from "./style.css";
export const ValueProps = (props) => {
    return (React.createElement("ul", { className: styles.valuePropsContainer, "data-automation": "value-props" }, props.links.map((link, index) => {
        const displayOptions = link.displayOptions || {};
        const { id } = displayOptions;
        const icon = iconLinksMap[id];
        const external = getLinkApp(id) !== props.client;
        return (React.createElement("li", { key: id || "footer-valueprop-" + index },
            React.createElement(Link, { to: "help", className: icon && styles.iconLink, onClick: () => {
                    props.track(link.ctaText, props.client);
                }, href: link.url, extraAttributes: {
                    "data-automation": id,
                }, external: displayOptions.targetBlank || external, targetSelf: !displayOptions.targetBlank },
                icon,
                React.createElement("span", { className: styles.valuePropsContainerText }, link.ctaText))));
    })));
};
export default ValueProps;
//# sourceMappingURL=index.js.map