import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import withSWNavigator from "../../../../hoc/withSWNavigator";
import withSecondaryBarSet from "../../../../hoc/withSecondaryBarSet";
import withLegacyWorkspacesFetch from "../../../../hoc/withLegacyWorkspacesFetch";
import withDomainExtraction from "pages/sales-intelligence/hoc/withDomainExtraction";
import withWebsiteInfo from "pages/sales-intelligence/hoc/withWebsiteInfo";
import {
    downloadOutgoingTableExcelThunk,
    fetchOutgoingTrafficTableThunk,
    fetchOutgoingTrafficWithUpdateListOpportunitiesThunk,
} from "../../store/effects";
import withTrafficTypeFromUrl from "../../hoc/withTrafficTypeFromUrl";
import CompetitorsCustomersResultsPage from "../CompetitorsCustomersResultsPage/CompetitorsCustomersResultsPage";
import { setOutgoingTableFiltersAction } from "../../store/action-creators";
import {
    selectOutgoingCategories,
    selectOutgoingTable,
    selectOutgoingTableExcelDownloading,
    selectOutgoingTableFetching,
    selectOutgoingTableFilters,
} from "../../store/selectors";
import {
    selectAllUniqueWebsites,
    selectOpportunityListUpdating,
} from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import {
    selectActiveSelectorPanel,
    selectExcelQuota,
} from "pages/sales-intelligence/sub-modules/common/store/selectors";
import { setMultiSelectorPanelByDefaultThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";

const mapStateToProps = (state: RootState) => ({
    tableData: selectOutgoingTable(state),
    tableDataFetching: selectOutgoingTableFetching(state),
    tableFilters: selectOutgoingTableFilters(state),
    categories: selectOutgoingCategories(state),
    excelDownloading: selectOutgoingTableExcelDownloading(state),
    listUpdating: selectOpportunityListUpdating(state),
    usedLeadsLimits: selectAllUniqueWebsites(state).length,
    excelQuota: selectExcelQuota(state),
    activePanel: selectActiveSelectorPanel(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchTableData: fetchOutgoingTrafficTableThunk,
            downloadTableExcel: downloadOutgoingTableExcelThunk,
            setTableFilters: setOutgoingTableFiltersAction,
            updateOpportunitiesList: fetchOutgoingTrafficWithUpdateListOpportunitiesThunk,
            setMultiSelectorPanelByDefault: setMultiSelectorPanelByDefaultThunk,
        },
        dispatch,
    );
};

const OutgoingSearchResultsPageContainer = compose(
    withSecondaryBarSet("SalesIntelligenceFind"),
    withLegacyWorkspacesFetch,
    withSWNavigator,
    withDomainExtraction,
    withWebsiteInfo(),
    withTrafficTypeFromUrl,
    connect(mapStateToProps, mapDispatchToProps),
)(CompetitorsCustomersResultsPage);

SWReactRootComponent(OutgoingSearchResultsPageContainer, "OutgoingSearchResultsPageContainer");

export default OutgoingSearchResultsPageContainer;
