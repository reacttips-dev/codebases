import { compose } from "redux";
import { connect } from "react-redux";
import { RootState } from "store/types";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import HomePage from "./HomePage";
import withSecondaryBarSet from "../../hoc/withSecondaryBarSet";
import withLegacyWorkspacesFetch from "../../hoc/withLegacyWorkspacesFetch";
import { selectOpportunityLists } from "../../sub-modules/opportunities/store/selectors";

/**
 * @param state
 */
const mapStateToProps = (state: RootState) => ({
    opportunityLists: selectOpportunityLists(state),
});

const HomePageContainer = compose(
    connect(mapStateToProps, null),
    withLegacyWorkspacesFetch,
    withSecondaryBarSet("SalesIntelligenceHome"),
)(HomePage);

SWReactRootComponent(HomePageContainer, "HomePageContainer");

export type HomePageContainerProps = ReturnType<typeof mapStateToProps>;
export default HomePageContainer;
