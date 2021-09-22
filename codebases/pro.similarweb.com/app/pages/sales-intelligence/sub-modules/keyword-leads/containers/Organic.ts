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
import { setOrganicFiltersAction } from "../store/action-creators";
import { organicMapStateToProps } from "../store/selectors";
import { withKeywordTypeFromUrl } from "../hoc/withKeywordType";
import { fetchOrganicWithUpdateListOpportunitiesThunk } from "../store/effects/organicEffects";
import { setMultiSelectorPanelByDefaultThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchData: fetchEffect.fetchOrganicThunk,
            downloadTableExcel: fetchEffect.downloadOrganicExcelThunk,
            setTableFilters: setOrganicFiltersAction,
            updateOpportunitiesList: fetchOrganicWithUpdateListOpportunitiesThunk,
            setMultiSelectorPanelByDefault: setMultiSelectorPanelByDefaultThunk,
        },
        dispatch,
    );
};

export const OrganicKeywordLeadsContainer = compose(
    withSecondaryBarSet("SalesIntelligenceFind"),
    withLegacyWorkspacesFetch,
    withSWNavigator,
    withDomainExtraction,
    withKeywordTypeFromUrl,
    connect(organicMapStateToProps, mapDispatchToProps),
)(View);

SWReactRootComponent(OrganicKeywordLeadsContainer, "OrganicKeywordLeadsContainer");
