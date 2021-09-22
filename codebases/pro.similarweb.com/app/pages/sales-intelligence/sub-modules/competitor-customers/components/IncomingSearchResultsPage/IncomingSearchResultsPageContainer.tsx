import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import withSWNavigator from "../../../../hoc/withSWNavigator";
import withSecondaryBarSet from "../../../../hoc/withSecondaryBarSet";
import withLegacyWorkspacesFetch from "../../../../hoc/withLegacyWorkspacesFetch";
import CompetitorsCustomersResultsPage from "../CompetitorsCustomersResultsPage/CompetitorsCustomersResultsPage";
import withDomainExtraction from "pages/sales-intelligence/hoc/withDomainExtraction";
import withWebsiteInfo from "pages/sales-intelligence/hoc/withWebsiteInfo";
import withTrafficTypeFromUrl from "../../hoc/withTrafficTypeFromUrl";
import { setIncomingTableFiltersAction } from "../../store/action-creators";
import {
    downloadIncomingTableExcelThunk,
    fetchIncomingTrafficTableThunk,
    fetchIncomingTrafficWithUpdateListOpportunitiesThunk,
} from "../../store/effects";
import {
    selectIncomingCategories,
    selectIncomingTable,
    selectIncomingTableExcelDownloading,
    selectIncomingTableFetching,
    selectIncomingTableFilters,
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
    tableData: selectIncomingTable(state),
    tableDataFetching: selectIncomingTableFetching(state),
    tableFilters: selectIncomingTableFilters(state),
    categories: selectIncomingCategories(state),
    excelDownloading: selectIncomingTableExcelDownloading(state),
    listUpdating: selectOpportunityListUpdating(state),
    usedLeadsLimits: selectAllUniqueWebsites(state).length,
    excelQuota: selectExcelQuota(state),
    activePanel: selectActiveSelectorPanel(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchTableData: fetchIncomingTrafficTableThunk,
            downloadTableExcel: downloadIncomingTableExcelThunk,
            setTableFilters: setIncomingTableFiltersAction,
            updateOpportunitiesList: fetchIncomingTrafficWithUpdateListOpportunitiesThunk,
            setMultiSelectorPanelByDefault: setMultiSelectorPanelByDefaultThunk,
        },
        dispatch,
    );
};

const IncomingSearchResultsPageContainer = compose(
    withSecondaryBarSet("SalesIntelligenceFind"),
    withLegacyWorkspacesFetch,
    withSWNavigator,
    withDomainExtraction,
    withWebsiteInfo(),
    withTrafficTypeFromUrl,
    connect(mapStateToProps, mapDispatchToProps),
)(CompetitorsCustomersResultsPage);

SWReactRootComponent(IncomingSearchResultsPageContainer, "IncomingSearchResultsPageContainer");

export default IncomingSearchResultsPageContainer;
