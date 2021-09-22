import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { bindActionCreators, compose } from "redux";
import withSecondaryBarSet from "../../../../../hoc/withSecondaryBarSet";
import withSWNavigator from "../../../../../hoc/withSWNavigator";
import withLegacyWorkspacesFetch from "../../../../../hoc/withLegacyWorkspacesFetch";
import withMatchIndustryTables from "pages/sales-intelligence/hoc/withMatchIndustryTables";
import withIndustryTableConnect from "pages/sales-intelligence/sub-modules/industries/hoc/withIndustryTableConnect";
import { IndustryResult } from "./IndustryResult";
import { RootState, ThunkDispatchCommon } from "store/types";
import {
    updateListOpportunitiesThunk,
    downloadListTableExcelThunk,
} from "pages/sales-intelligence/sub-modules/industries/store/effects";
import {
    selectAllUniqueWebsites,
    selectOpportunityListUpdating,
} from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import { selectExcelDownloading } from "pages/sales-intelligence/sub-modules/industries/store/selectors";
import {
    selectActiveSelectorPanel,
    selectExcelQuota,
} from "pages/sales-intelligence/sub-modules/common/store/selectors";
import { setMultiSelectorPanelByDefaultThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";

const mapStateToProps = (state: RootState) => ({
    excelDownloading: selectExcelDownloading(state),
    listUpdating: selectOpportunityListUpdating(state),
    usedLeadsLimit: selectAllUniqueWebsites(state).length,
    excelQuota: selectExcelQuota(state),
    activePanel: selectActiveSelectorPanel(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            downloadTableExcel: downloadListTableExcelThunk,
            updateOpportunitiesList: updateListOpportunitiesThunk,
            setMultiSelectorPanelByDefault: setMultiSelectorPanelByDefaultThunk,
        },
        dispatch,
    );
};

const IndustryResultContainer = compose(
    withSecondaryBarSet("SalesIntelligenceFind"),
    withSWNavigator,
    withMatchIndustryTables,
    withLegacyWorkspacesFetch,
    withIndustryTableConnect,
    connect(mapStateToProps, mapDispatchToProps),
)(IndustryResult);

export type IndustryResultContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

SWReactRootComponent(IndustryResultContainer, "IndustryResultContainer");

export default IndustryResultContainer;
