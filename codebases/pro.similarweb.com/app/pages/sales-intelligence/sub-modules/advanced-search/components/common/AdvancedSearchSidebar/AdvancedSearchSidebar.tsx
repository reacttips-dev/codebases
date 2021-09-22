import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import SalesWorkspaceApiService from "services/workspaces/salesWorkspaceApiService";
import SidebarContainer from "../../../../right-sidebar/components/Sidebar/SidebarContainer";
import { fetchDataForRightBarThunkAction } from "pages/workspace/sales/sub-modules/common/store/effects";
import { selectLegacyWorkspaceId } from "pages/sales-intelligence/sub-modules/common/store/selectors";
import { selectActiveWebsite } from "pages/workspace/sales/sub-modules/opportunities-lists/store/selectors";
import { WORLDWIDE_COUNTRY_ID } from "pages/sales-intelligence/constants/common";

// Legacy line of code
const getExcelTableRowHref = new SalesWorkspaceApiService().getExcelTableRowHref;

const AdvancedSearchSidebar = (
    props: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
) => {
    const { selectedWebsite, workspaceId } = props;

    React.useEffect(() => {
        if (selectedWebsite && workspaceId) {
            props.OLDFetchDataForSidebar(selectedWebsite.domain, undefined, WORLDWIDE_COUNTRY_ID);
        }
    }, [selectedWebsite?.domain, workspaceId]);

    if (!workspaceId) {
        return null;
    }

    return <SidebarContainer getExcelTableRowHref={getExcelTableRowHref} />;
};

const mapStateToProps = (state: RootState) => ({
    workspaceId: selectLegacyWorkspaceId(state),
    selectedWebsite: selectActiveWebsite(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            OLDFetchDataForSidebar: fetchDataForRightBarThunkAction,
        },
        dispatch,
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AdvancedSearchSidebar) as React.ComponentType<{}>;
