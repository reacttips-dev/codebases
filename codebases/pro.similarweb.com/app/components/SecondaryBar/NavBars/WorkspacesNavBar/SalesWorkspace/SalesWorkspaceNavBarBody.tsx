import { swSettings } from "common/services/swSettings";
import { SalesWorkspaceLeadsGroup } from "components/SecondaryBar/NavBars/WorkspacesNavBar/SalesWorkspace/SalesWorkspaceLeadsGroup";
import TranslationProvider from "components/WithTranslation/src/TranslationProvider";
import { i18nFilter } from "filters/ngFilters";
import { commonActionCreators } from "pages/workspace/common/actions_creators/COPY_common_worksapce_action_creators";
import { OVERVIEW_ID } from "pages/workspace/common/consts";
import { selectActiveOpportunityList } from "pages/workspace/common/selectors";
import { shouldLockModule } from "pages/workspace/common/workspacesUtils";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { bindActionCreators } from "redux";
import { DefaultFetchService } from "services/fetchService";
import { allTrackers } from "services/track/track";
import SalesWorkspaceApiService from "services/workspaces/salesWorkspaceApiService";
import { connect } from "react-redux";
import {
    AddFromGenerator,
    DropdownItem,
} from "pages/workspace/common components/AddOpportunitiesButton/src/NewLeadsCreationDropdown";
import { SalesKeys as keys } from "pages/workspace/common components/AddOpportunitiesButton/src/LeadCreationDropdownKeys";
import { IWorkspaceNavBarBodyProps } from "pages/workspace/common/types";
import { NavBarSimpleItemSW } from "./styles";
import { toggleRightBar } from "pages/workspace/sales/sub-modules/common/store/action-creators";
import { StyledBodyContainer } from "components/SecondaryBar/NavBars/WorkspacesNavBar/SalesWorkspace/styles";
import { RootState, ThunkDispatchCommon } from "store/types";

const SalesWorkspaceNavBarBody: FC<IWorkspaceNavBarBodyProps> = ({
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
    const [leadsGroupItems, setLeadsGroupItems] = useState(null);
    const [isGeneratorLocked, setIsGeneratorLocked] = useState(false);
    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const isGeneratorLimited = useRef(
        swSettings.components.SalesWorkspace.resources.LeadGeneratorNumberOfQueriesLimit,
    );

    const services = useMemo(() => {
        return {
            fetchService: DefaultFetchService.getInstance(),
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

    const isLeadsListEmpty = (list) => {
        return list && list.opportunities && !!list.opportunities.length;
    };

    const toggleCreateNewListModal = () => {
        setActiveList(OVERVIEW_ID)();

        const isEmptyState =
            !isTableLoading && !isLeadsListEmpty(activeOpportunitiesList) && !isError;

        allTrackers.trackEvent(
            "Websites Modal",
            !isWebsitesModalOpen ? "open" : "close",
            `Create and add companies${isEmptyState ? "/empty state" : ""}`,
        );

        toggleWebsitesModal();

        allTrackers.trackEvent("Add companies", "click", "Side bar/Add and Track Companies");
    };

    const createLeadsGroupItems = (items) => {
        return items.map((item) => (
            <NavBarSimpleItemSW
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

            setLeadsGroupItems(createLeadsGroupItems(listItemsData));
        }
    }, [
        activeWorkspace,
        activeWorkspace?.opportunityLists?.length,
        activeListId,
        activeWorkspaceId,
    ]);

    const onMenuToggle = (isOpened) => {
        setIsMenuOpened(isOpened);
    };

    const shouldGeneratorBeLocked = async () => {
        const { total, used } = await services.fetchService.get(
            "api/grow-reports-management/quota",
        );
        return total <= used;
    };

    useEffect(() => {
        if (isMenuOpened) {
            // check if has reached lead creation generator max allowed leads
            const checkGeneratorLockedStatus = async () => {
                if (isGeneratorLimited.current && !isGeneratorLocked) {
                    let shouldBeLocked = false;
                    try {
                        shouldBeLocked = await shouldGeneratorBeLocked();
                        setIsGeneratorLocked(shouldBeLocked);
                    } catch (e) {
                        setIsGeneratorLocked(shouldBeLocked);
                    }
                }
            };

            checkGeneratorLockedStatus();
        }
    }, [isMenuOpened, isGeneratorLimited.current, isGeneratorLocked, setIsGeneratorLocked]);

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
        <StyledBodyContainer>
            <TranslationProvider translate={services.translate}>
                <SalesWorkspaceLeadsGroup
                    selectedId={activeListId}
                    leadsGroupItems={leadsGroupItems}
                    menuItems={renderMenuItems}
                    onMenuToggle={onMenuToggle}
                    onMenuItemClick={() => null /*handleMenuItemClick*/}
                    onCreateNewListClick={toggleCreateNewListModal}
                />
            </TranslationProvider>
        </StyledBodyContainer>
    );
};

const mapStateToProps = (state: RootState) => {
    const { legacySalesWorkspace, routing } = state;
    const { currentPage, params } = routing;
    const {
        activeWorkspaceId,
        activeListId,
        workspaces,
        isWebsitesModalOpen,
        isWebsitesWizardOpen,
        isTableLoading,
        isError,
    } = legacySalesWorkspace;
    const activeWorkspace = workspaces[0];
    const activeOpportunitiesList = selectActiveOpportunityList(legacySalesWorkspace) || {};

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

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    const api = new SalesWorkspaceApiService();
    const actionsObject = commonActionCreators({
        api,
        component: swSettings.components.SalesWorkspace,
    });

    const {
        toggleUnlockModal,
        toggleWebsitesModal,
        toggleWebsitesWizard,
        selectActiveList,
        unSelectActiveSearchList,
        fetchListOpportunities,
        fetchRecommendations,
    } = bindActionCreators(actionsObject, dispatch);

    return {
        toggleRightBar: (status: boolean) => dispatch(toggleRightBar(status)),
        toggleUnlockModal,
        toggleWebsitesModal,
        toggleWebsitesWizard,
        fetchListOpportunities,
        fetchRecommendations,
        selectActiveList,
        unSelectActiveSearchList,
    };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(SalesWorkspaceNavBarBody);
export default connected;
