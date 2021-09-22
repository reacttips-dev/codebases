import * as React from "react";
import SearchPage from "pages/SearchPage";
import messages from "../translations/messages";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {State} from "store";
import {connect} from "react-redux";
import {DynamicContentModel, SearchResult, SearchPathTypes, GlobalCMSContexts, ContextItemTypes} from "models";
import {RoutingActionCreators, routingActionCreators} from "actions/routingActions";
import {bindActionCreators} from "redux";
import {InjectedRouter} from "react-router";
import {PLPPageProps} from "pages/ProductListingPage";

export interface SearchProps {
    query: string;
    dynamicContent?: DynamicContentModel;
    searchResult: SearchResult;
    router: InjectedRouter;
}

export interface DispatchProps {
    routingActions: RoutingActionCreators;
}

type SearchContainerType = SearchProps & DispatchProps & InjectedIntlProps & PLPPageProps;

export const SearchContainer: React.FC<SearchContainerType> = (props: SearchContainerType) => {
    const {query, intl, searchResult} = props;
    const title = !!query && intl.formatMessage(messages.titleH1, {keyword: query});
    const label = !!query && intl.formatMessage(messages.breadcrumb, {keyword: query});
    const queryBreadcrumb = {
        categoryId: "All Categories",
        label,
        onClick: (e) => handleBreadcrumbClick(e, props.router, props.routingActions),
    };
    const paths = searchResult ? searchResult.paths.filter((path) => path.type === SearchPathTypes.Category) : [];
    const pathsBreadCrumb = paths.map((path) => ({
        linkTypeId: path.name,
        label: path.name,
        onClick: (e) => handleBreadcrumbClick(e, props.router, props.routingActions, path.selectPath),
        path: path.selectPath,
    }));
    const pageBottomGlobalContent = {
        context: GlobalCMSContexts.searchBottom,
        contentType: ContextItemTypes.customContent,
    };

    return (
        <SearchPage
            title={title || ""}
            headTags={{metaTitle: title}}
            breadcrumbList={[queryBreadcrumb, ...pathsBreadCrumb]}
            desktopTitleOnly={true}
            pageBottomGlobalContent={pageBottomGlobalContent}
            {...props}
        />
    );
};

export const handleBreadcrumbClick = (
    e,
    router: InjectedRouter,
    routingActions: RoutingActionCreators,
    categoryPath?: string,
) => {
    const searchParam = router.location.query.search ? `search=${router.location.query.search}` : "";
    routingActions.push({
        pathname: router.location.pathname,
        search: `?${categoryPath ? "path=" + categoryPath + "&" : ""}${searchParam}`,
    });
};

const mapStateToProps = (state: State, ownProps: PLPPageProps) => {
    return {
        query: state.search.query,
        dynamicContent: state.search.dynamicContent,
        searchResult: state.search.searchResult,
        router: ownProps.router,
    };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        routingActions: bindActionCreators(routingActionCreators, dispatch),
    };
};

export default connect<SearchProps, DispatchProps, PLPPageProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(SearchContainer));
