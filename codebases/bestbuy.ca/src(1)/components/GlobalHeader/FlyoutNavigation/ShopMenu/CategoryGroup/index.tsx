import { ChevronRight } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import { getShopLinkHref } from "../";
import { convertLocaleToLang } from "../../../../../models";
import Link from "../../../Link";
import SubCategory from "../SubCategory";
import * as styles from "./style.css";
const CategoryGroup = (props) => React.createElement("div", { className: `${props.className} ${styles.subCategoryContainer}` },
    React.createElement("div", { className: styles.mainCategoryTitle },
        props.category.event &&
            React.createElement(Link, { onClick: () => props.selectCategory(props.category.event), extraAttributes: { "data-automation": "category-l1-group-title" }, params: [
                    props.category.event.seoText,
                    props.category.event.eventId,
                ], href: getShopLinkHref(props.category.event, convertLocaleToLang(props.intl.locale)), external: props.client !== "ecomm-webapp" || props.category.event.eventType === "externalUrl" }, props.category.event.ctaText),
        props.category.exploreMoreEvent && React.createElement("span", null,
            React.createElement(Link, { onClick: () => props.selectCategory(props.category.exploreMoreEvent), className: styles.mainCategoryViewAll, extraAttributes: { "data-automation": "category-l1-explore-more" }, params: [
                    props.category.exploreMoreEvent.seoText,
                    props.category.exploreMoreEvent.eventId,
                ], href: getShopLinkHref(props.category.exploreMoreEvent, convertLocaleToLang(props.intl.locale)), external: props.client !== "ecomm-webapp" || props.category.event.eventType === "externalUrl" },
                props.category.exploreMoreEvent.ctaText,
                " ",
                React.createElement(ChevronRight, { color: "blue", viewBox: "0 0 26 26" })))),
    React.createElement("div", { className: styles.mainCategorySection }, props.category.categories && props.category.categories.filter((l2Category) => !!l2Category.event).map((l2Category, index) => React.createElement(SubCategory, { selectCategory: props.selectCategory, client: props.client, key: index, l2Category: l2Category }))));
export default injectIntl(CategoryGroup);
//# sourceMappingURL=index.js.map