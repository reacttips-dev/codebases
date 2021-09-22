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
import { setMobileFiltersAction } from "../store/action-creators";
import { mobileMapStateToProps } from "../store/selectors";
import { withKeywordTypeFromUrl } from "../hoc/withKeywordType";
import { fetchMobileWithUpdateListOpportunitiesThunk } from "pages/sales-intelligence/sub-modules/keyword-leads/store/effects/mobileEffects";
import { setMultiSelectorPanelByDefaultThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchData: fetchEffect.fetchMobileThunk,
            downloadTableExcel: fetchEffect.downloadMobileExcelThunk,
            setTableFilters: setMobileFiltersAction,
            updateOpportunitiesList: fetchMobileWithUpdateListOpportunitiesThunk,
            setMultiSelectorPanelByDefault: setMultiSelectorPanelByDefaultThunk,
        },
        dispatch,
    );
};

export const MobileKeywordLeadsContainer = compose(
    withSecondaryBarSet("SalesIntelligenceFind"),
    withLegacyWorkspacesFetch,
    withSWNavigator,
    withDomainExtraction,
    withKeywordTypeFromUrl,
    connect(mobileMapStateToProps, mapDispatchToProps),
)(View);

SWReactRootComponent(MobileKeywordLeadsContainer, "MobileKeywordLeadsContainer");
