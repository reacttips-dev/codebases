import React from "react";
import { tableActionsCreator } from "actions/tableActions";
import { connect } from "react-redux";
import {
    removeOpportunitiesFromTheListAndReFetchWithTopThunk,
    updateListOpportunitiesFromSearchThunk,
} from "pages/sales-intelligence/sub-modules/opportunities/store/effects";
import { bindActionCreators } from "redux";
import {
    selectActiveSelectorPanelItemConfig,
    selectSelectedDomains,
} from "pages/sales-intelligence/sub-modules/common/store/selectors";
import { selectOpportunityListUpdating } from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import { RootState, ThunkDispatchCommon } from "store/types";
import { setIsOpenOpportunityList } from "pages/sales-intelligence/sub-modules/opportunities/store/action-creators";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import {
    getActionSetDefaultItemConfig,
    getActionSetItemConfig,
} from "pages/sales-intelligence/helpers/multiSelectorPanel/helpers";

type OwnProps = {
    tableSelectionKey: string;
    tableSelectionProperty: string;
    domainKey: string;
    active: TypeOfSelectors;
};

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    const { tableSelectionKey, tableSelectionProperty } = ownProps;
    return {
        selectedDomains: selectSelectedDomains(tableSelectionKey, tableSelectionProperty)(state),
        listUpdating: selectOpportunityListUpdating(state),
        selectorPanelItemConfig: selectActiveSelectorPanelItemConfig(state),
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatchCommon, ownProps: OwnProps) => {
    const { tableSelectionKey, tableSelectionProperty, active } = ownProps;
    const { clearAllSelectedRows } = tableActionsCreator(tableSelectionKey, tableSelectionProperty);

    return bindActionCreators(
        {
            clearAllSelectedRows: () => clearAllSelectedRows(true),
            updateListOpportunities: updateListOpportunitiesFromSearchThunk,
            removeOpportunitiesFromList: removeOpportunitiesFromTheListAndReFetchWithTopThunk,
            setIsOpen: setIsOpenOpportunityList,
            setSelectPanelItemByDefaultConfig: getActionSetDefaultItemConfig(active),
            setSelectPanelItemConfig: getActionSetItemConfig(active),
        },
        dispatch,
    );
};

export type WithSelectionTableOptionsProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export const withSelectTableOptions = <PROPS extends {}>(Component: React.ComponentType<PROPS>) => {
    return connect(mapStateToProps, mapDispatchToProps)(Component);
};
