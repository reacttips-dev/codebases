import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { FIND_LEADS_PAGE_ROUTE } from "../../constants/routes";
import withSecondaryBarSet from "../../hoc/withSecondaryBarSet";
import withSWNavigator from "../../hoc/withSWNavigator";
import withFallbackRoute from "../../hoc/withFallbackRoute";
import FindLeadsSearchResultPage from "./FindLeadsSearchResultPage";
import withLegacyWorkspacesFetch from "../../hoc/withLegacyWorkspacesFetch";
import withReportResultGuard from "../../sub-modules/saved-searches/hoc/withReportResultGuard";
import { NotSavedSearchType, SavedSearchType } from "../../sub-modules/saved-searches/types";
import { toggleSaveSearchModal } from "../../sub-modules/saved-searches/store/action-creators";
import { selectSavedSearches } from "../../sub-modules/saved-searches/store/selectors";
import { selectExcelQuotaRemaining } from "pages/sales-intelligence/sub-modules/common/store/selectors";

/**
 * @param state
 */
const mapStateToProps = (state: RootState) => ({
    savedSearches: selectSavedSearches(state),
    remainExportQuota: selectExcelQuotaRemaining(state),
});

/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators({ toggleSaveSearchModal }, dispatch);
};

const FindLeadsSearchResultPageContainer = compose(
    withSecondaryBarSet("SalesIntelligenceFind"),
    withSWNavigator,
    withFallbackRoute(FIND_LEADS_PAGE_ROUTE),
    withReportResultGuard,
    withLegacyWorkspacesFetch,
    connect(mapStateToProps, mapDispatchToProps),
)(FindLeadsSearchResultPage);

SWReactRootComponent(FindLeadsSearchResultPageContainer, "FindLeadsSearchResultPageContainer");

export type FindLeadsSearchResultPageContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> & {
        searchObject: SavedSearchType | NotSavedSearchType;
    };
export default FindLeadsSearchResultPageContainer;
