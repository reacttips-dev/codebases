import * as React from "react";
import CategoryPage from "pages/CategoryPage";
import {injectIntl} from "react-intl";
import State from "store";
import {connect} from "react-redux";
import {Category, GlobalCMSContexts, GlobalCMSContextMap} from "models";
import {convertCategoryFiltersToBreadcrumb} from "utils/builders";
import {tracker} from "@bbyca/ecomm-utilities";
import {buildAdItemsFromGlobalContentContexts} from "components/Advertisement";
import {getGlobalContentContexts, getGlobalContentPropsByContext} from "utils/globalContent";
import {CategoryFilter} from "@bbyca/apex-components/dist/models";

export interface CategoryProps {
    category: Category;
    globalContent: GlobalCMSContextMap;
}

const PLP_FOOTER_GLOBAL_CONTEXTS: GlobalCMSContexts[] = [
    GlobalCMSContexts.categoryBottom,
    GlobalCMSContexts.categoryFooter,
];

export interface CategoryContainerAdTargeting {
    breadcrumb: string;
    categoryId: string;
}

export const CategoryContainer: React.FC<CategoryProps> = (props: CategoryProps) => {
    const {category, globalContent} = props;
    let metaTitle = "";
    if (category) {
        const {dynamicContent} = category;
        metaTitle = (dynamicContent && dynamicContent.seo && dynamicContent.seo.headerTitle) || category.seoTitle;
    }

    const plpFooterGlobalContexts = getGlobalContentContexts(globalContent, PLP_FOOTER_GLOBAL_CONTEXTS);
    const globalContentAdItems = buildAdItemsFromGlobalContentContexts(plpFooterGlobalContexts);
    const pageBottomGlobalContent = getGlobalContentPropsByContext(GlobalCMSContexts.categoryBottom);
    const pageFooterGlobalContent = getGlobalContentPropsByContext(GlobalCMSContexts.categoryFooter);
    const categoryAdTargeting: CategoryContainerAdTargeting = {
        categoryId: category && category.id,
        breadcrumb:
            category &&
            category.categoryBreadcrumb &&
            category.categoryBreadcrumb.map(({categoryId}) => categoryId).join(","),
    };
    return (
        <CategoryPage
            headTags={{metaTitle}}
            title={category && category.name}
            dynamicContent={category && category.dynamicContent}
            dynamicUrlParams={category && [category.seoText, category.id]}
            breadcrumbList={category && buildBreadcrumbList(category.categoryBreadcrumb)}
            ads={{
                adItems: globalContentAdItems,
                adTargeting: categoryAdTargeting,
            }}
            pageBottomGlobalContent={pageBottomGlobalContent}
            pageFooterGlobalContent={pageFooterGlobalContent}
            {...props}
        />
    );
};

const buildBreadcrumbList = (categoryBreadcrumb: CategoryFilter[]) =>
    convertCategoryFiltersToBreadcrumb(categoryBreadcrumb, handleBreadcrumbClick);

const handleBreadcrumbClick = (e: Event, categoryId: string) => {
    tracker.dispatchEvent({
        action: "Click",
        category: "Breadcrumb",
        label: categoryId,
    });
};

const mapStateToProps = (state: State) => {
    return {
        category: state.search.category,
        globalContent: state.app.globalContent.content,
    };
};

export default connect<CategoryProps, {}, {}, State>(mapStateToProps)(injectIntl(CategoryContainer));
