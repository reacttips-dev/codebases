import * as React from "react";
import SearchPage from "pages/SearchPage";
import {Brand, DynamicContentModel, GlobalCMSContexts, ContextItemTypes} from "models";
import {injectIntl} from "react-intl";
import {connect} from "react-redux";
import State from "store";

export interface BrandProps {
    brand?: Brand;
    dynamicContent?: DynamicContentModel;
}

export const BrandContainer: React.FC<BrandProps> = (props: BrandProps) => {
    const {brand, dynamicContent} = props;
    const title = brand && brand.name; // TODO: brand.name comes in as all caps. Check with SEO if this is good or bad.
    const dynamicContentH1 = dynamicContent && dynamicContent.h1;
    const metaTitle = (dynamicContent && dynamicContent.seo && dynamicContent.seo.headerTitle) || title;
    const pageFooterGlobalContent = {
        context: GlobalCMSContexts.brandFooter,
        contentType: ContextItemTypes.customContent,
    };
    const breadcrumb = [{label: dynamicContentH1 || title}];

    return (
        <SearchPage
            title={dynamicContentH1 || title}
            headTags={{metaTitle}}
            breadcrumbList={breadcrumb}
            dynamicUrlParams={brand && [brand.name.toLowerCase()]}
            pageFooterGlobalContent={pageFooterGlobalContent}
            showListings={dynamicContent?.productListing?.displayProductListing}
            {...props}
        />
    );
};

const mapStateToProps = (state: State) => {
    return {
        brand: state.search.brand,
        dynamicContent: state.search.dynamicContent,
    };
};

export default connect<BrandProps>(mapStateToProps)(injectIntl(BrandContainer));
