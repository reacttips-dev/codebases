import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { ThunkDispatchCommon } from "store/types";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import withDomainExtraction from "pages/sales-intelligence/hoc/withDomainExtraction";
import withSecondaryBarSet from "pages/sales-intelligence/hoc/withSecondaryBarSet";
import withLegacyWorkspacesFetch from "pages/sales-intelligence/hoc/withLegacyWorkspacesFetch";
import withSWNavigator from "pages/sales-intelligence/hoc/withSWNavigator";
import { View } from "../components/Result/View";
import { fetchEffect } from "../store/effects";
import { setPaidFiltersAction } from "../store/action-creators";
import { paidMapStateToProps } from "../store/selectors";
import { withKeywordTypeFromUrl } from "../hoc/withKeywordType";
import { fetchPaidWithUpdateListOpportunitiesThunk } from "pages/sales-intelligence/sub-modules/keyword-leads/store/effects/paidEffects";
import { setMultiSelectorPanelByDefaultThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchData: fetchEffect.fetchPaidThunk,
            downloadTableExcel: fetchEffect.downloadPaidExcelThunk,
            setTableFilters: setPaidFiltersAction,
            updateOpportunitiesList: fetchPaidWithUpdateListOpportunitiesThunk,
            setMultiSelectorPanelByDefault: setMultiSelectorPanelByDefaultThunk,
        },
        dispatch,
    );
};

export const PaidKeywordLeadsContainer = compose(
    withSecondaryBarSet("SalesIntelligenceFind"),
    withLegacyWorkspacesFetch,
    withSWNavigator,
    withDomainExtraction,
    withKeywordTypeFromUrl,
    connect(paidMapStateToProps, mapDispatchToProps),
)(View);

SWReactRootComponent(PaidKeywordLeadsContainer, "PaidKeywordLeadsContainer");
