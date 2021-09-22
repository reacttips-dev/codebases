import { ChevronDown, ChevronUp, DisplayDefault, Expandable, } from "@bbyca/bbyca-components";
import * as React from "react";
import Link from "../../../../GlobalHeader/Link";
import { getLinkApp } from "../../../utils/appMap";
import iconMap from "../icons";
import * as styles from "./style.css";
const LinkGroup = ({ contentParser, client, linkGroup, title, onLinkClick, }) => {
    const svgIconProps = {
        viewBox: "0 0 32 32",
        color: "black",
        className: styles.expandableIcon,
    };
    return (React.createElement("div", { className: styles.linkGroup }, linkGroup && (React.createElement(Expandable, { className: styles.expandableContainer, headerText: title, openedIcon: React.createElement(ChevronUp, Object.assign({}, svgIconProps)), closedIcon: React.createElement(ChevronDown, Object.assign({}, svgIconProps)) },
        React.createElement(DisplayDefault, { className: styles.expandableContent },
            React.createElement("ul", { className: styles.primaryLinkList }, linkGroup &&
                linkGroup.map((link, index) => {
                    const displayOptions = link.displayOptions || {};
                    const { id, urlExpression, dataAttributes = {} } = displayOptions;
                    const icon = iconMap[id];
                    const href = urlExpression ? contentParser(urlExpression) : link.url;
                    const external = getLinkApp(id) !== client;
                    const dataAttr = Object.assign({ "data-automation": id }, dataAttributes);
                    return (React.createElement("li", { key: id || "footer-primary-" + index },
                        React.createElement(Link, { onClick: () => onLinkClick(link.ctaText), className: icon && styles.iconLink, href: href, extraAttributes: dataAttr, external: displayOptions.targetBlank || external, targetSelf: !displayOptions.targetBlank },
                            icon,
                            link.ctaText)));
                })))))));
};
export default LinkGroup;
//# sourceMappingURL=index.js.map