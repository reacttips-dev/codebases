import { ChevronRight } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import { HeaderContext } from "../..";
import { convertLocaleToLang, } from "../../../../models";
import { LinkEvent } from "../../../../utils/linkEvent";
import Link from "../../Link";
import CategoryGroup from "./CategoryGroup";
import * as styles from "./style.css";
export class ShopMenu extends React.Component {
    constructor(props) {
        super(props);
        this.selectCategory = (event) => {
            this.props.resetFlyout();
            const categoryBreadCrumb = this.getBreadcrumbForEvent(event, this.props.shopMenuContent.shopCategories);
            this.props.trackMenu(categoryBreadCrumb);
        };
        this.mouseEnter = (e, index) => {
            clearTimeout(this.timerInt);
            this.timerInt = setTimeout(() => this.setState({ selectedIndex: index }), 100);
        };
        this.mouseLeave = (e) => {
            clearTimeout(this.timerInt);
        };
        this.state = {
            selectedIndex: 0,
        };
    }
    render() {
        const { shopMenuContent } = this.props;
        if (!shopMenuContent) {
            return null;
        }
        const { shopCategories } = shopMenuContent;
        if (!shopCategories || shopCategories.length === 0) {
            return null;
        }
        return (React.createElement("div", { className: styles.container },
            React.createElement("ul", { className: styles.categoryList, "data-automation": "category-list" }, shopCategories
                .filter((category) => !!category.event)
                .map((category, index) => (React.createElement("li", { key: index, onMouseEnter: (e) => this.mouseEnter(e, index), onMouseLeave: this.mouseLeave },
                React.createElement(Link, { onClick: () => this.selectCategory(category.event), extraAttributes: {
                        "data-automation": "category-l1",
                    }, className: this.state.selectedIndex === index
                        ? styles.selected
                        : "", params: [
                        category.event.seoText,
                        category.event.eventId,
                    ], href: getShopLinkHref(category.event, convertLocaleToLang(this.props.intl.locale)), external: this.props.client !== "ecomm-webapp", targetSelf: this.props.client !== "ecomm-webapp" },
                    category.event.ctaText,
                    React.createElement(ChevronRight, { color: "white", className: styles.arrowRight, viewBox: "0 0 24 24" })))))),
            shopCategories
                .filter((categoryGroup) => !!categoryGroup.event)
                .map((categoryGroup, index) => {
                const classNames = [
                    styles.categoryGroup,
                    this.state.selectedIndex === index && styles.visible,
                ].filter((style) => style).join(" ");
                return (React.createElement(CategoryGroup, { client: this.props.client, key: index, className: classNames, category: categoryGroup, selectCategory: this.selectCategory }));
            })));
    }
    componentDidMount() {
        const { shopMenuContent, retrieveShopMenuContent, intl } = this.props;
        if (!shopMenuContent) {
            retrieveShopMenuContent(intl.locale);
        }
    }
    getBreadcrumbForEvent(event, shopCategories) {
        if (shopCategories) {
            for (const shopCategory of shopCategories) {
                if (shopCategory.event === event) {
                    return [this.getEventText(event)];
                }
                else if (shopCategory.exploreMoreEvent &&
                    shopCategory.exploreMoreEvent === event) {
                    return [
                        this.getEventText(shopCategory.event),
                        this.getEventText(shopCategory.exploreMoreEvent),
                    ];
                }
                else {
                    const value = this.getBreadcrumbForEvent(event, shopCategory.categories);
                    if (value !== null) {
                        return [
                            this.getEventText(shopCategory.event),
                            ...value,
                        ];
                    }
                }
            }
        }
        return null;
    }
    getEventText(event) {
        if (convertLocaleToLang(this.props.intl.locale) === "fr") {
            return event.altCtaText || "";
        }
        else {
            return event.ctaText || "";
        }
    }
}
export const getShopLinkHref = (event, language) => {
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
        return "";
    }
};
export default injectIntl((props) => (React.createElement(HeaderContext.Consumer, null, (value) => (React.createElement(ShopMenu, Object.assign({ client: value.client }, props))))));
//# sourceMappingURL=index.js.map