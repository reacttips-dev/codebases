import * as React from "react";
import { LinkEvent } from "../../utils";
import MenuSection from "./components/MenuSection";
import * as styles from "./style.css";
export const MenuContext = React.createContext({
    client: "",
    onNavigate: () => null,
    trackMenuSelection: () => null,
    isVisible: false,
});
export const MenuPanel = (props) => {
    const { className, shopMenuContent } = props;
    if (!shopMenuContent) {
        return null;
    }
    return React.createElement(MenuContext.Provider, { value: {
            client: props.client,
            onNavigate: props.onNavigate,
            trackMenuSelection: props.trackMenuSelection,
            isVisible: props.isVisible,
        } },
        React.createElement("div", { className: `${styles.menuPanel} ${className}` },
            React.createElement(MenuSection, { isMainCategory: true, onBackClick: props.onBackClick, menuData: {
                    categories: shopMenuContent.categories,
                }, hierarchy: [], locale: props.locale, menuTitle: props.menuTitle })));
};
export const getLinkHref = (event, language) => {
    if (event.ctaText && event.eventId) {
        try {
            return new LinkEvent({
                eventId: event.eventId,
                language,
                eventType: event.eventType,
                url: event.url,
                seoText: event.seoText,
                query: event.query || {},
            }).toHref();
        }
        catch (error) {
            return;
        }
    }
    else {
        return;
    }
};
export default MenuPanel;
//# sourceMappingURL=index.js.map