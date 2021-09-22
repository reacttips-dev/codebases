import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import { commonActionCreators } from "pages/workspace/common/actions_creators/COPY_common_worksapce_action_creators";
import { OVERVIEW_ID } from "pages/workspace/common/consts";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { NavBarDefaultHeader } from "@similarweb/ui-components/dist/navigation-bar";
import { bindActionCreators } from "redux";
import SalesWorkspaceApiService from "services/workspaces/salesWorkspaceApiService";
import { RootState, ThunkDispatchCommon } from "store/types";

export const SalesWorkspaceNavBarHeader: FunctionComponent<any> = (props) => {
    const {
        selectActiveList,
        isWebsitesWizardOpen,
        toggleWebsitesWizard,
        isRightBarOpen,
        toggleRightBar,
    } = props;

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
        };
    }, []);

    const handleClick = useCallback(() => {
        if (isWebsitesWizardOpen) {
            toggleWebsitesWizard(false);
        }
        if (isRightBarOpen) {
            toggleRightBar(false);
        }
        selectActiveList(OVERVIEW_ID);
    }, [
        selectActiveList,
        toggleWebsitesWizard,
        isWebsitesWizardOpen,
        toggleRightBar,
        isRightBarOpen,
    ]);

    return (
        <NavBarDefaultHeader
            text={services.translate("workspace.sales.sidenav.title")}
            onClick={handleClick}
        />
    );
};

const mapStateToProps = ({ legacySalesWorkspace }: RootState) => {
    const { isWebsitesWizardOpen, isRightBarOpen } = legacySalesWorkspace;
    return {
        isWebsitesWizardOpen,
        isRightBarOpen,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    const api = new SalesWorkspaceApiService();
    const actionsObject = commonActionCreators({
        api,
        component: swSettings.components.SalesWorkspace,
    });

    const { selectActiveList, toggleRightBar, toggleWebsitesWizard } = bindActionCreators(
        actionsObject,
        dispatch,
    );

    return {
        selectActiveList,
        toggleRightBar,
        toggleWebsitesWizard,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesWorkspaceNavBarHeader);
