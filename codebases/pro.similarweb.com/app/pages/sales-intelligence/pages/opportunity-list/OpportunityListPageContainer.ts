import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import withSWNavigator, { WithSWNavigatorProps } from "../../hoc/withSWNavigator";
import withSecondaryBarSet from "../../hoc/withSecondaryBarSet";
import OpportunityListPage from "./OpportunityListPage";
import withNotFoundListGuard from "./hoc/withNotFoundListGuard";
import withOpportunityListPageContext from "./hoc/withOpportunityListPageContext";
import {
    removeOpportunityList,
    toggleOpportunityListSettingsModal,
    setSelectedOpportunityListNameAndIdAction,
    setShowRightBarAction,
} from "../../sub-modules/opportunities/store/action-creators";
import { selectOpportunityListSettingsModal } from "../../sub-modules/opportunities/store/selectors";
import { toggleRightBar as toggleRightBarSales } from "pages/workspace/sales/sub-modules/common/store/action-creators";

/**
 * @param state
 */
const mapStateToProps = (state: RootState) => ({
    settingsModal: selectOpportunityListSettingsModal(state),
});

/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleSettingsModal: toggleOpportunityListSettingsModal,
            removeOpportunityList: removeOpportunityList,
            toggleRightBarSales: (status: boolean) => dispatch(toggleRightBarSales(status)),
            setSelectedListNameAndId: setSelectedOpportunityListNameAndIdAction,
            setShowRightBar: setShowRightBarAction,
        },
        dispatch,
    );
};

const OpportunityListPageContainer = compose(
    withSecondaryBarSet("SalesIntelligenceLists"),
    withSWNavigator,
    withNotFoundListGuard,
    withOpportunityListPageContext,
    connect(mapStateToProps, mapDispatchToProps),
)(OpportunityListPage);

SWReactRootComponent(OpportunityListPageContainer, "OpportunityListPageContainer");

export type OpportunityListPageContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    WithSWNavigatorProps;
export default OpportunityListPageContainer;
