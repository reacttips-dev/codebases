import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { ThunkDispatchCommon } from "store/types";
import ControlsSection from "./ControlsSection";
import withLegacyWorkspaceId, {
    WithLegacyWorkspaceIdProps,
} from "../../../../../hoc/withLegacyWorkspaceId";
import {
    toggleOpportunityListModal,
    toggleRecommendationsBarAction,
} from "../../../../../sub-modules/opportunities/store/action-creators";
import { fetchOpportunityListTableDataThunk } from "pages/sales-intelligence/sub-modules/opportunities/store/effects";
import { setMultiSelectorPanelByDefaultThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchListTableData: fetchOpportunityListTableDataThunk,
            toggleListModal: toggleOpportunityListModal,
            toggleRecommendationsBar: toggleRecommendationsBarAction,
            setMultiSelectorPanelByDefault: setMultiSelectorPanelByDefaultThunk,
        },
        dispatch,
    );
};

const ControlsSectionContainer = compose(
    connect(null, mapDispatchToProps),
    withLegacyWorkspaceId,
)(ControlsSection);

export type ControlsSectionContainerProps = ReturnType<typeof mapDispatchToProps> &
    WithLegacyWorkspaceIdProps;
export default ControlsSectionContainer as React.FC;
