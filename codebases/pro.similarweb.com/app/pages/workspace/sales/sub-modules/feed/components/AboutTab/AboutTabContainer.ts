import React from "react";
import { connect } from "react-redux";
import { RootState } from "single-spa/store/types";
import { compose } from "redux";
import { selectActiveWebsite } from "pages/workspace/sales/sub-modules/opportunities-lists/store/selectors";
import { selectCountryRightBar } from "pages/workspace/sales/sub-modules/common/store/selectors";
import { AboutTab } from "./AboutTab";
import { selectOpportunityLists } from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";

const mapStateToProps = (state: RootState) => ({
    selectedWebsite: selectActiveWebsite(state),
    selectedCountry: selectCountryRightBar(state),
    opportunityLists: selectOpportunityLists(state),
});

export type AboutTabContainerProps = ReturnType<typeof mapStateToProps> & WithSWNavigatorProps;

export default compose(connect(mapStateToProps, null), withSWNavigator)(AboutTab) as React.FC;
