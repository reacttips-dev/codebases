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
import { setTotalFiltersAction } from "../store/action-creators";
import { totalMapStateToProps } from "../store/selectors";
import { withKeywordTypeFromUrl } from "../hoc/withKeywordType";
import { fetchTotalWithUpdateListOpportunitiesThunk } from "../store/effects/totalEffects";
import { setMultiSelectorPanelByDefaultThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchData: fetchEffect.fetchTotalThunk,
            downloadTableExcel: fetchEffect.downloadTotalExcelThunk,
            setTableFilters: setTotalFiltersAction,
            updateOpportunitiesList: fetchTotalWithUpdateListOpportunitiesThunk,
            setMultiSelectorPanelByDefault: setMultiSelectorPanelByDefaultThunk,
        },
        dispatch,
    );
};

export const TotalKeywordLeadsContainer = compose(
    withSecondaryBarSet("SalesIntelligenceFind"),
    withLegacyWorkspacesFetch,
    withSWNavigator,
    withDomainExtraction,
    withKeywordTypeFromUrl,
    connect(totalMapStateToProps, mapDispatchToProps),
)(View);

SWReactRootComponent(TotalKeywordLeadsContainer, "TotalKeywordLeadsContainer");
