import { InjectedIntlProps } from "react-intl";
import { tracker } from "@bbyca/ecomm-utilities";
import { SearchActionCreators } from "actions";
import { BreadcrumbListItem, Category, DetailedProduct as Product } from "models";
import { convertCategoryFiltersToBreadcrumb, getBreadcrumbRoot } from "utils/builders/breadcrumbBuilder";

export interface Props {
    category: Category;
    product: Product;
    searchActions: SearchActionCreators;
}

export const createBreadcrumbList = (props: Props & InjectedIntlProps, breadcrumbEnds: BreadcrumbListItem[]): BreadcrumbListItem[] | [] => {
    const { category, intl, product, searchActions } = props;
    const breadcrumbs = category &&
        category.categoryBreadcrumb &&
        product.primaryParentCategoryId === category.id ?
        convertCategoryFiltersToBreadcrumb(category.categoryBreadcrumb, handleCategoryBreadcrumbClick, searchActions) :
        [];
    breadcrumbs.unshift(getBreadcrumbRoot(intl));
    breadcrumbs.push(...breadcrumbEnds);
    return breadcrumbs;
};

const handleCategoryBreadcrumbClick = (e, categoryId: string, searchActions: SearchActionCreators) => {
    e.preventDefault();
    tracker.dispatchEvent({
        action: "Click",
        category: "Breadcrumb",
        label: categoryId,
    });
    searchActions.searchByCategory(categoryId);
};
