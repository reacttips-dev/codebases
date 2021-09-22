import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { ThunkDispatchCommon } from "store/types";
import { MY_LISTS_PAGE_ROUTE } from "../../../../constants/routes";
import withNotFoundSearchGuard from "../../hoc/withNotFoundSearchGuard";
import withSecondaryBarSet from "../../../../hoc/withSecondaryBarSet";
import withFallbackRoute from "../../../../hoc/withFallbackRoute";
import withSWNavigator from "../../../../hoc/withSWNavigator";
import DynamicListPage from "./DynamicListPage";
import { toggleSavedSearchSettingsModal } from "../../store/action-creators";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleSearchSettingModal: toggleSavedSearchSettingsModal,
        },
        dispatch,
    );
};

const DynamicListPageContainer = compose(
    withSecondaryBarSet("SalesIntelligenceLists"),
    withSWNavigator,
    withFallbackRoute(MY_LISTS_PAGE_ROUTE),
    withNotFoundSearchGuard,
    connect(null, mapDispatchToProps),
)(DynamicListPage);

SWReactRootComponent(DynamicListPageContainer, "DynamicListPageContainer");

export default DynamicListPageContainer;
