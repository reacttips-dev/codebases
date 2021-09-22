import * as React from "react";
import { MenuContext } from "../..";
import { EventTypes } from "../../../../models";
import Link from "../../../GlobalHeader/Link";
import * as styles from "../../style.css";
const MenuHeader = ({ className, menuData, title, hierarchy = [], href }) => {
    if (href && menuData && menuData.event) {
        const { eventId = "", seoText = "", ctaText = "", eventType = "" } = menuData.event;
        return React.createElement(MenuContext.Consumer, null, (context) => (React.createElement(Link, { className: `${styles.headerLink} ${className}`, extraAttributes: {
                "data-automation": "x-menu-item",
            }, href: href, params: [seoText, eventId], external: eventType === EventTypes.externalUrl, onClick: () => {
                context.trackMenuSelection(hierarchy);
                context.onNavigate();
            } }, title || ctaText)));
    }
    else {
        return React.createElement("div", { className: `${styles.item} ${styles.menuItem} ${styles.headerNoLink}` }, title);
    }
};
export default MenuHeader;
//# sourceMappingURL=index.js.map