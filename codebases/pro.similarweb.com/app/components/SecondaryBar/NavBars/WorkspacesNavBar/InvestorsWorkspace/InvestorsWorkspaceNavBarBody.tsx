import { swSettings } from "common/services/swSettings";
import { InvestorsWorkspaceOpportunitiesGroup } from "components/SecondaryBar/NavBars/WorkspacesNavBar/InvestorsWorkspace/InvestorsWorkspaceOpportunitiesGroup";
import TranslationProvider from "components/WithTranslation/src/TranslationProvider";
import { i18nFilter } from "filters/ngFilters";
import { InvestorKeys as keys } from "pages/workspace/common components/AddOpportunitiesButton/src/LeadCreationDropdownKeys";
import {
    AddFromGenerator,
    DropdownItem,
} from "pages/workspace/common components/AddOpportunitiesButton/src/NewLeadsCreationDropdown";
import { commonActionCreators } from "pages/workspace/common/actions_creators/common_worksapce_action_creators";
import { OVERVIEW_ID } from "pages/workspace/common/consts";
import { selectActiveOpportunityList } from "pages/workspace/common/selectors";
import { shouldLockModule } from "pages/workspace/common/workspacesUtils";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { NavBarSimpleItem } from "@similarweb/ui-components/dist/navigation-bar";
import { bindActionCreators } from "redux";
import { allTrackers } from "services/track/track";
import InvestorsWorkspaceApiService from "services/workspaces/investorsWorkspaceApiService";
import { IWorkspaceNavBarBodyProps } from "pages/workspace/common/types";
import { connect } from "react-redux";
import styled from "styled-components";

const BodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 8px;
    padding-right: 8px;
`;

const InvestorsWorkspaceNavBarBody: FC<IWorkspaceNavBarBodyProps> = ({
    activeWorkspace,
    activeWorkspaceId,
    activeListId,
    activeOpportunitiesList,
    selectActiveList,
    fetchListOpportunities,
    fetchRecommendations,
    toggleWebsitesModal,
    toggleWebsitesWizard,
    toggleUnlockModal,
    toggleRightBar,
    isWebsitesModalOpen,
    isWebsitesWizardOpen,
    isTableLoading,
    isError,
}) => {
    const [opportunitiesGroupItems, setOpportunitiesGroupItems] = useState(null);
    const [isGeneratorLocked, setIsGeneratorLocked] = useState(false);

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
        };
    }, []);

    const setActiveList = (listId: string) => () => {
        allTrackers.trackEvent("lists", "click", `Side Bar/${listId}`);
        selectActiveList(listId);
        if (listId !== OVERVIEW_ID) {
            fetchListOpportunities(activeWorkspaceId, listId, {});
            fetchRecommendations(activeWorkspaceId, listId);
        }
        toggleWebsitesWizard(false);
        toggleRightBar(false);
    };

    const isOpportunitiesListEmpty = (list) => {
        return list && list.opportunities && !!list.opportunities.length;
    };

    const toggleCreateNewListModal = () => {
        setActiveList(OVERVIEW_ID)();

        const isEmptyState =
            !isTableLoading && !isOpportunitiesListEmpty(activeOpportunitiesList) && !isError;

        allTrackers.trackEvent(
            "Websites Modal",
            !isWebsitesModalOpen ? "open" : "close",
            `Create and add companies${isEmptyState ? "/empty state" : ""}`,
        );

        toggleWebsitesModal();

        allTrackers.trackEvent("Add companies", "click", "Side bar/Add and Track Companies");
    };

    const createOpportunitiesGroupItems = (items) => {
        return items.map((item) => (
            <NavBarSimpleItem
                key={item.id}
                id={item.id}
                text={item.text}
                isSelected={activeListId === item.id}
                onClick={setActiveList(item.id)}
            />
        ));
    };

    useEffect(() => {
        if (activeWorkspace?.opportunityLists) {
            const { opportunityLists = [] } = activeWorkspace;

            const listItemsData = opportunityLists.map(({ friendlyName, opportunityListId }) => ({
                id: opportunityListId,
                text: friendlyName,
            }));

            setOpportunitiesGroupItems(createOpportunitiesGroupItems(listItemsData));
        }
    }, [
        activeWorkspace,
        activeWorkspace?.opportunityLists?.length,
        activeListId,
        activeWorkspaceId,
    ]);

    // check if has lead creation generator permission
    const isSourceLeadsLocked = shouldLockModule(
        swSettings.components.WsSourceLeads.resources.AvaliabilityMode,
    );

    const createNewListFromGenerator = () => {
        allTrackers.trackEvent("Internal link", "click", "Find leads/from home page/from sidebar");
        setActiveList(OVERVIEW_ID)();
        allTrackers.trackEvent(
            "Internal Link",
            "click",
            "From home page/Find and Source Companies",
        );
        if (isSourceLeadsLocked) {
            toggleUnlockModal(true);

            return;
        }
        toggleWebsitesWizard(!isWebsitesWizardOpen);

        // We want the dropdown to close on <DropdownItem/> click, however, the <DropdownItem/>
        // received preventDefault={true} and therefor won't close without a body click.
        document.body.click();
    };

    const createNewListFromModal = () => {
        toggleCreateNewListModal();
        // We want the dropdown to close on <DropdownItem/> click, however, the <DropdownItem/>
        // received preventDefault={true} and therefor won't close without a body click.
        document.body.click();
    };

    const renderMenuItems = useCallback(() => {
        return [
            <DropdownItem
                preventDefault={true}
                onClick={createNewListFromModal}
                iconName="add"
                title={services.translate(keys.addManuallyTitle)}
                description={services.translate(keys.addManuallyDescription)}
            />,
            <AddFromGenerator
                isGeneratorLocked={isGeneratorLocked}
                onAddFromGeneratorClick={createNewListFromGenerator}
                keys={keys}
            />,
        ];
    }, [services, isGeneratorLocked]);

    return (
        <BodyContainer>
            <TranslationProvider translate={services.translate}>
                <InvestorsWorkspaceOpportunitiesGroup
                    selectedId={activeListId}
                    opportunitiesGroupItems={opportunitiesGroupItems}
                    menuItems={renderMenuItems}
                    onMenuItemClick={() => null /*handleMenuItemClick*/}
                    onCreateNewListClick={toggleCreateNewListModal}
                ></InvestorsWorkspaceOpportunitiesGroup>
            </TranslationProvider>
        </BodyContainer>
    );
};

const mapStateToProps = (state) => {
    const { commonWorkspace, routing } = state;
    const { currentPage, params } = routing;
    const {
        activeWorkspaceId,
        activeListId,
        workspaces,
        isWebsitesModalOpen,
        isWebsitesWizardOpen,
        isTableLoading,
        isError,
    } = commonWorkspace;
    const activeWorkspace = workspaces[0];
    const activeOpportunitiesList = selectActiveOpportunityList(commonWorkspace) || {};

    return {
        params,
        currentPage,
        activeWorkspace,
        activeWorkspaceId,
        activeListId,
        isWebsitesModalOpen,
        isWebsitesWizardOpen,
        activeOpportunitiesList,
        isTableLoading,
        isError,
    };
};

const mapDispatchToProps = (dispatch) => {
    const api = new InvestorsWorkspaceApiService();
    const actionsObject = commonActionCreators({
        api,
        component: swSettings.components.InvestorsWorkspace,
    });

    const {
        toggleRightBar,
        toggleUnlockModal,
        toggleWebsitesModal,
        toggleWebsitesWizard,
        selectActiveList,
        unSelectActiveSearchList,
        fetchListOpportunities,
        fetchRecommendations,
    } = bindActionCreators(actionsObject, dispatch);

    return {
        toggleRightBar,
        toggleUnlockModal,
        toggleWebsitesModal,
        toggleWebsitesWizard,
        fetchListOpportunities,
        fetchRecommendations,
        selectActiveList,
        unSelectActiveSearchList,
    };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(InvestorsWorkspaceNavBarBody);
export default connected;
