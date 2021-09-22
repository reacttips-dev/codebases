import * as React from "react";
import SearchPage from "pages/SearchPage";
import {Ssc, GlobalCMSContexts, Seo} from "models";
import {injectIntl} from "react-intl";
import {connect} from "react-redux";
import State from "store";
import {getGlobalContentPropsByContext} from "utils/globalContent";

export interface SSCProps {
    ssc: Ssc;
    seo: Seo;
}
export const SSCContainer: React.FC<SSCProps> = (props: SSCProps) => {
    const {ssc, seo} = props;
    const title = ssc && ssc.title;
    const headTags = {
        metaTitle: (seo && seo.headerTitle) || title,
        metaRobots: {name: "robots", content: `${seo && seo.discoverable ? "index,follow" : "noindex,nofollow"}`}, // TODO: Check if we want to apply this to all pages
    };
    const pageBottomGlobalContent = getGlobalContentPropsByContext(GlobalCMSContexts.collectionBottom);
    const pageFooterGlobalContent = getGlobalContentPropsByContext(GlobalCMSContexts.collectionFooter);
    return (
        <SearchPage
            title={title}
            headTags={headTags}
            pageFooterGlobalContent={pageFooterGlobalContent}
            pageBottomGlobalContent={pageBottomGlobalContent}
            {...props}
        />
    );
};

const mapStateToProps = (state: State) => {
    return {
        ssc: state.search.searchResult && state.search.searchResult.ssc,
        seo: state.search.dynamicContent && state.search.dynamicContent.seo,
    };
};

SSCContainer.displayName = "SSCContainer";

export default connect<SSCProps>(mapStateToProps)(injectIntl(SSCContainer));
