import React from "react";
import AdvancedSearchPage from "./AdvancedSearchPage";
import withSearchResultsRequest from "../../../hoc/withSearchResultsRequest";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";

type NewSearchPageContainerProps = WithSWNavigatorProps;

const NewSearchPageContainer = (props: NewSearchPageContainerProps) => {
    return <AdvancedSearchPage {...props} />;
};

export default withSearchResultsRequest(NewSearchPageContainer);
