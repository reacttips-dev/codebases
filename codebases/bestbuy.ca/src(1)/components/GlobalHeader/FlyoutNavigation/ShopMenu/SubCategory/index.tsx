import { ChevronRight } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import { getShopLinkHref } from "../";
import { convertLocaleToLang } from "../../../../../models";
import Link from "../../../Link";
import * as styles from "./style.css";
export const SubCategory = (props) => React.createElement("div", { className: styles.subCategoryList, "data-automation": "subcategory-list" },
    React.createElement("ul", { className: styles.subCategories },
        React.createElement("li", { key: props.l2Category.event.ctaText },
            React.createElement(Link, { onClick: () => props.selectCategory(props.l2Category.event), extraAttributes: { "data-automation": "category-l2" }, params: [
                    props.l2Category.event.seoText,
                    props.l2Category.event.eventId,
                ], href: getShopLinkHref(props.l2Category.event, convertLocaleToLang(props.intl.locale)), external: props.l2Category.event.eventType === "externalUrl", targetSelf: props.client !== "ecomm-webapp" }, props.l2Category.event.ctaText)),
        props.l2Category.categories.map((l3Category) => React.createElement("li", { key: l3Category.event.ctaText },
            React.createElement(Link, { onClick: () => props.selectCategory(l3Category.event), extraAttributes: { "data-automation": "category-l3" }, params: [
                    l3Category.event.seoText,
                    l3Category.event.eventId,
                ], href: getShopLinkHref(l3Category.event, convertLocaleToLang(props.intl.locale)), external: l3Category.event.eventType === "externalUrl" }, l3Category.event.ctaText))),
        props.l2Category.exploreMoreEvent &&
            React.createElement("li", { key: props.l2Category.exploreMoreEvent.ctaText },
                React.createElement(Link, { onClick: () => props.selectCategory(props.l2Category.exploreMoreEvent), className: styles.exploreMore, extraAttributes: { "data-automation": "category-l2-explore-more" }, params: [
                        props.l2Category.exploreMoreEvent.seoText,
                        props.l2Category.exploreMoreEvent.eventId,
                    ], href: getShopLinkHref(props.l2Category.exploreMoreEvent, convertLocaleToLang(props.intl.locale)), external: props.l2Category.event.eventType === "externalUrl" },
                    props.l2Category.exploreMoreEvent.ctaText,
                    " ",
                    React.createElement(ChevronRight, { color: "blue", viewBox: "0 0 28 28" })))));
export default injectIntl(SubCategory);
//# sourceMappingURL=index.js.map