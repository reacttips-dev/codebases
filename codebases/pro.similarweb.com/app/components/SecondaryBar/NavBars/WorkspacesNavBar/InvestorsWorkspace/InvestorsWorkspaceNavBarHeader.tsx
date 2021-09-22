import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import { commonActionCreators } from "pages/workspace/common/actions_creators/common_worksapce_action_creators";
import { OVERVIEW_ID } from "pages/workspace/common/consts";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { NavBarDefaultHeader } from "@similarweb/ui-components/dist/navigation-bar";
import { bindActionCreators } from "redux";
import InvestorsWorkspaceApiService from "services/workspaces/investorsWorkspaceApiService";

export const InvestorsWorkspaceNavBarHeader: FunctionComponent<any> = (props) => {
    const { selectActiveList, isWebsitesWizardOpen, toggleWebsitesWizard } = props;

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
        };
    }, []);

    const handleClick = useCallback(() => {
        if (isWebsitesWizardOpen) {
            toggleWebsitesWizard(false);
        }
        selectActiveList(OVERVIEW_ID);
    }, [selectActiveList, toggleWebsitesWizard, isWebsitesWizardOpen]);

    return (
        <NavBarDefaultHeader
            text={services.translate("workspace.investors.sidenav.title")}
            onClick={handleClick}
        />
    );
};

const mapStateToProps = ({ commonWorkspace }) => {
    const { isWebsitesWizardOpen } = commonWorkspace;
    return {
        isWebsitesWizardOpen,
    };
};

const mapDispatchToProps = (dispatch) => {
    const api = new InvestorsWorkspaceApiService();
    const actionsObject = commonActionCreators({
        api,
        component: swSettings.components.InvestorsWorkspace,
    });

    const { selectActiveList, toggleWebsitesWizard } = bindActionCreators(actionsObject, dispatch);

    return {
        selectActiveList,
        toggleWebsitesWizard,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InvestorsWorkspaceNavBarHeader);
