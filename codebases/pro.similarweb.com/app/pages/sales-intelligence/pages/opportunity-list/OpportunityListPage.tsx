import React, { useEffect } from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { goToListPage } from "../../helpers/helpers";
import { OpportunityListType } from "../../sub-modules/opportunities/types";
import { MY_LISTS_PAGE_ROUTE } from "../../constants/routes";
import { StyledOpportunityListsDropdown } from "./components/lists-dropdown/OpportunityListsDropdown/styles";
import * as styles from "./styles";
import TopBar from "./components/top-bar/TopBar/TopBar";
import ListPageHeader from "./components/header/ListPageHeader/ListPageHeader";
import ListSettingsModal from "./components/settings-modal/ListSettingsModal/ListSettingsModal";
import ListTableContainer from "./components/table/ListTableContainer";
import { OpportunityListPageContainerProps } from "./OpportunityListPageContainer";
import SidebarContainer from "../../sub-modules/right-sidebar/components/Sidebar/SidebarContainer";
import SalesWorkspaceApiService from "services/workspaces/salesWorkspaceApiService";
import RecommendationsSidebarContainer from "../../sub-modules/opportunities/components/RecommendationsSidebar/RecommendationsSidebarContainer";

type OpportunityListPageProps = {
    lists: OpportunityListType[];
};

const getExcelTableRowHref = new SalesWorkspaceApiService().getExcelTableRowHref;

const OpportunityListPage = ({
    lists,
    navigator,
    settingsModal,
    toggleSettingsModal,
    removeOpportunityList,
    toggleRightBarSales,
    setSelectedListNameAndId,
    setShowRightBar,
}: OpportunityListPageProps & OpportunityListPageContainerProps) => {
    useEffect(() => {
        const selectedList = lists[0];
        setSelectedListNameAndId({
            opportunityListId: selectedList.opportunityListId,
            opportunityListName: selectedList.friendlyName,
        });
    }, []);

    const handleBackClick = React.useCallback(() => {
        setSelectedListNameAndId({
            opportunityListId: "",
            opportunityListName: "",
        });
        navigator.go(MY_LISTS_PAGE_ROUTE);
    }, [navigator]);

    const handleListSelection = (list: OpportunityListType) => {
        setSelectedListNameAndId({
            opportunityListId: list.opportunityListId,
            opportunityListName: list.friendlyName,
        });
        setShowRightBar(false);
        goToListPage(navigator)(list);
    };

    const openListSettingsModal = React.useCallback(() => toggleSettingsModal(true), [
        toggleSettingsModal,
    ]);

    React.useEffect(() => {
        return () => {
            toggleRightBarSales(false);
        };
    }, []);

    return (
        <styles.StyledListPageContainer>
            <ListSettingsModal
                modal={settingsModal}
                navigator={navigator}
                toggleModal={toggleSettingsModal}
                onOpportunityListRemove={removeOpportunityList}
            />
            <TopBar onBackClick={handleBackClick}>
                <StyledOpportunityListsDropdown lists={lists} onSelect={handleListSelection} />
                <styles.StyledListSettingsButton>
                    <IconButton
                        type="flat"
                        iconName="settings"
                        onClick={openListSettingsModal}
                        dataAutomation="list-header-settings-button"
                    />
                </styles.StyledListSettingsButton>
            </TopBar>
            <ListPageHeader />
            <ListTableContainer />
            <SidebarContainer getExcelTableRowHref={getExcelTableRowHref} />
            <RecommendationsSidebarContainer />
        </styles.StyledListPageContainer>
    );
};

export default OpportunityListPage;
