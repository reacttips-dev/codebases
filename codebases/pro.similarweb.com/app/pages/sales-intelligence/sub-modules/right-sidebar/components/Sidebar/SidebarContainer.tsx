import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";
import { selectRightBarIsOpen } from "pages/workspace/sales/sub-modules/common/store/selectors";
import { selectActiveWebsite } from "pages/workspace/sales/sub-modules/opportunities-lists/store/selectors";
import { toggleRightBar } from "pages/workspace/sales/sub-modules/common/store/action-creators";
import Sidebar from "./Sidebar";

type SidebarContainerProps = {
    isOpen: boolean;
    selectedWebsite: BaseWebsiteType;
    toggleRightSidebar(isOpen: boolean): void;
    // TODO: Legacy code, remove.
    getExcelTableRowHref(...args: any): string;
};

const SidebarContainer = (props: SidebarContainerProps) => {
    const { isOpen, toggleRightSidebar, selectedWebsite, getExcelTableRowHref } = props;

    return (
        <Sidebar
            isOpen={isOpen}
            website={selectedWebsite}
            getExcelTableRowHref={getExcelTableRowHref}
            closeSidebar={() => toggleRightSidebar(false)}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    isOpen: selectRightBarIsOpen(state),
    selectedWebsite: selectActiveWebsite(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleRightSidebar: toggleRightBar,
        },
        dispatch,
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SidebarContainer) as React.ComponentType<{
    getExcelTableRowHref(...args: any): string;
}>;
