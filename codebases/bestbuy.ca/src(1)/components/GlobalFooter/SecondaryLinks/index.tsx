import * as React from "react";
import { FormattedMessage } from "react-intl";
import Link from "../../GlobalHeader/Link";
import { getLinkApp } from "../utils/appMap";
import * as styles from "./style.css";
import messages from "./translations/messages";
export const SecondaryLinks = (props) => {
    return (React.createElement("div", { className: styles.container, "data-automation": "secondary-links" },
        React.createElement("div", { className: styles.secondaryLinkListContainer },
            React.createElement("p", { className: styles.copyright },
                React.createElement(FormattedMessage, Object.assign({}, messages.copyright))),
            React.createElement("ul", { className: styles.secondaryLinkList }, props.links.map((link, index) => {
                const displayOptions = link.displayOptions || {};
                const { id } = displayOptions;
                const external = getLinkApp(id) !== props.client;
                return (React.createElement("li", { key: "footer-secondary-" + index, className: styles.secondaryLinks },
                    React.createElement(Link, { onClick: () => {
                            props.track(link.ctaText, props.client);
                        }, extraAttributes: { "data-automation": id }, href: link.url, external: displayOptions.targetBlank || external, targetSelf: !displayOptions.targetBlank }, link.ctaText)));
            })))));
};
export default SecondaryLinks;
//# sourceMappingURL=index.js.map