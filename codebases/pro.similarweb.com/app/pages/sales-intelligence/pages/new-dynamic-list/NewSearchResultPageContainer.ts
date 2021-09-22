import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { ThunkDispatchCommon } from "store/types";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { MY_LISTS_PAGE_ROUTE } from "../../constants/routes";
import NewSearchResultPage from "./NewSearchResultPage";
import withFallbackRoute from "../../hoc/withFallbackRoute";
import withSecondaryBarSet from "../../hoc/withSecondaryBarSet";
import withSWNavigator from "../../hoc/withSWNavigator";
import { toggleSaveSearchModal } from "../../sub-modules/saved-searches/store/action-creators";
import withReportResultGuard from "../../sub-modules/saved-searches/hoc/withReportResultGuard";
import withLegacyWorkspacesFetch from "../../hoc/withLegacyWorkspacesFetch";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleSaveSearchModal,
        },
        dispatch,
    );
};

const NewSearchResultPageContainer = compose(
    withSecondaryBarSet("SalesIntelligenceLists"),
    withSWNavigator,
    withFallbackRoute(MY_LISTS_PAGE_ROUTE),
    withReportResultGuard,
    withLegacyWorkspacesFetch,
    connect(null, mapDispatchToProps),
)(NewSearchResultPage);

SWReactRootComponent(NewSearchResultPageContainer, "NewSearchResultPageContainer");

export default NewSearchResultPageContainer;
