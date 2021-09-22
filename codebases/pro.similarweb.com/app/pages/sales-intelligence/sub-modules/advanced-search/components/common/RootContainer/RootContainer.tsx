import React from "react";
import { compose } from "redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import withSecondaryBarSet, {
    WithSecondaryBarSetProps,
} from "../../../../../hoc/withSecondaryBarSet";
import withSWNavigator, { WithSWNavigatorProps } from "../../../../../hoc/withSWNavigator";
import withLegacyWorkspacesFetch from "pages/sales-intelligence/hoc/withLegacyWorkspacesFetch";
import withFiltersDescriptionRequest from "../../../hoc/withFiltersDescriptionRequest";
import withAllSavedSearchesRequest from "../../../hoc/withAllSavedSearchesRequest";
import withFiltersApplyFromTemplate from "../../../hoc/withFiltersApplyFromTemplate";
import SavedSearchPageContainer from "../AdvancedSearchPage/SavedSearchPageContainer";
import NewSearchPageContainer from "../AdvancedSearchPage/NewSearchPageContainer";

type RootContainerProps = WithSWNavigatorProps & WithSecondaryBarSetProps;

const RootContainer = (props: RootContainerProps) => {
    const { navigator } = props;
    const { id } = navigator.getParams();

    if (typeof id === "undefined") {
        return <NewSearchPageContainer navigator={navigator} />;
    }

    return <SavedSearchPageContainer searchId={id} navigator={navigator} />;
};

const ComposedRootContainer = compose(
    withSecondaryBarSet("SalesIntelligenceFind"),
    withLegacyWorkspacesFetch,
    withAllSavedSearchesRequest,
    withFiltersDescriptionRequest,
    withFiltersApplyFromTemplate,
    withSWNavigator,
)(RootContainer);

export default ComposedRootContainer;
SWReactRootComponent(ComposedRootContainer, "AdvancedSearchPageRoot");
