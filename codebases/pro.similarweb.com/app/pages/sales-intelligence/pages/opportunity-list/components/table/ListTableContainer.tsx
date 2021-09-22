import React from "react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import withLegacyWorkspaceId, {
    WithLegacyWorkspaceIdProps,
} from "../../../../hoc/withLegacyWorkspaceId";
import {
    setListTableFiltersAction,
    toggleRecommendationsBarAction,
    setShowRightBarAction,
    clearOpportunityListTableData,
} from "../../../../sub-modules/opportunities/store/action-creators";
import {
    selectListRecommendationsOpen,
    selectOpportunityListTable,
    selectOpportunityListName,
    selectOpportunityListTableDataFetching,
    selectOpportunityListTableExcelDownloading,
    selectOpportunityListTableFilters,
    selectShowRightBar,
} from "../../../../sub-modules/opportunities/store/selectors";
import ListTable from "./ListTable";
import {
    downloadListTableExcelThunk,
    fetchOpportunityListTableDataThunk,
    removeOpportunitiesFromTheListAndReFetchThunk,
} from "../../../../sub-modules/opportunities/store/effects";
import {
    selectRightBarIsOpen,
    selectCountryRightBar,
} from "pages/workspace/sales/sub-modules/common/store/selectors";
import { toggleRightBar as toggleRightBarSales } from "pages/workspace/sales/sub-modules/common/store/action-creators";
import { fetchDataForRightBarThunkAction } from "pages/workspace/sales/sub-modules/common/store/effects";
import { selectActiveWebsite } from "pages/workspace/sales/sub-modules/opportunities-lists/store/selectors";
import { selectWebsiteAction } from "pages/workspace/sales/sub-modules/opportunities-lists/store/action-creators";
import {
    selectActiveSelectorPanel,
    selectExcelQuota,
} from "pages/sales-intelligence/sub-modules/common/store/selectors";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import { setMultiSelectorPanelByDefaultThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";
import { selectActiveSignalFilterId } from "pages/workspace/sales/sub-modules/signals/store/selectors";

const mapStateToProps = (state: RootState) => ({
    tableFilters: selectOpportunityListTableFilters(state),
    listTableData: selectOpportunityListTable(state),
    listTableDataFetching: selectOpportunityListTableDataFetching(state),
    isRightBarOpenSales: selectRightBarIsOpen(state),
    selectedWebsite: selectActiveWebsite(state),
    selectedCountry: selectCountryRightBar(state),
    recommendationsBarOpen: selectListRecommendationsOpen(state),
    selectedOpportunityListName: selectOpportunityListName(state),
    isRightBarVisible: selectShowRightBar(state),
    excelDownloading: selectOpportunityListTableExcelDownloading(state),
    excelQuota: selectExcelQuota(state),
    activePanel: selectActiveSelectorPanel(state),
    selectedSignalFilter: selectActiveSignalFilterId(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleRightBarSales: (status: boolean) => dispatch(toggleRightBarSales(status)),
            setTableFilters: setListTableFiltersAction,
            fetchListTableData: fetchOpportunityListTableDataThunk,
            removeOpportunitiesFromList: removeOpportunitiesFromTheListAndReFetchThunk,
            selectWebsite: selectWebsiteAction,
            fetchDataForRightBar: fetchDataForRightBarThunkAction,
            toggleRecommendationsBar: toggleRecommendationsBarAction,
            setShowRightBar: setShowRightBarAction,
            clearTableData: clearOpportunityListTableData,
            downloadToExcel: downloadListTableExcelThunk,
            setMultiSelectorPanelByDefault: setMultiSelectorPanelByDefaultThunk,
        },
        dispatch,
    );
};

const ListTableContainer = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withLegacyWorkspaceId,
    withSWNavigator,
)(ListTable);

export type ListTableContainerProps = WithLegacyWorkspaceIdProps &
    WithSWNavigatorProps &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default ListTableContainer as React.FC;
