import React from "react";
import SidebarContainer from "pages/sales-intelligence/sub-modules/right-sidebar/components/Sidebar/SidebarContainer";
import SalesWorkspaceApiService from "services/workspaces/salesWorkspaceApiService";
import { connect } from "react-redux";
import { toggleRightBar as toggleRightBarSales } from "pages/workspace/sales/sub-modules/common/store/action-creators";
import { ThunkDispatchCommon } from "store/types";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return { toggleRightBar: (isOpen: boolean) => dispatch(toggleRightBarSales(isOpen)) };
};
// Provides action to call Sidebar
export const withToggleSalesAction = (Component: React.ComponentType<{}>) =>
    connect(null, mapDispatchToProps)(Component);

export type withSalesToggleActionType = {
    toggleRightBar: (state: boolean) => void;
};

// Wraps component and add Sales sidebar.
// To call it use action `toggleRightBarSales`
// ALERT don't call request for workspaceId because it will cause request loop
// To use it properly be sure to call fetchDataForRightBarThunkAction before, to get all CURRENT data
export const withSalesSidebar = <PROPS extends {}>(Child: React.ComponentType<PROPS>) => {
    // Later deprecated service must be replaced
    const workspaceService = new SalesWorkspaceApiService();
    const getExcelTableRowHref = workspaceService.getExcelTableRowHref;

    // eslint-disable-next-line react/display-name
    return (props: PROPS) => (
        <>
            <Child {...props} />
            <SidebarContainer getExcelTableRowHref={getExcelTableRowHref} />
        </>
    );
};
