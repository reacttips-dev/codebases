import {CategoryFilter, BreadcrumbListItem} from "models";
import messages from "./translations/messages";

export function getBreadcrumbRoot(intl): BreadcrumbListItem {
    return {
        label: intl.formatMessage(messages.home),
        linkType: "homepage",
    };
}

export function convertCategoryFiltersToBreadcrumb(
    categoryFilters: CategoryFilter[],
    onCategoryClick,
    searchActions?: any,
) {
    if (!categoryFilters || !categoryFilters.length) {
        return [];
    }
    return categoryFilters.slice(1).map(
        (category, index): BreadcrumbListItem => {
            return {
                linkTypeId: category.categoryId,
                label: category.name,
                linkType: "category",
                onClick: (e) =>
                    searchActions
                        ? onCategoryClick(e, category.categoryId, searchActions)
                        : onCategoryClick(e, category.categoryId),
                seoText: category.seoText,
            };
        },
    );
}
