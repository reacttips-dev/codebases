import React from "react";
import { SavedSearchType } from "../../types";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { WithSWNavigatorProps } from "../../../../hoc/withSWNavigator";
import TopBar from "pages/sales-intelligence/pages/opportunity-list/components/top-bar/TopBar/TopBar";
import SavedSearchSettingsModalContainer from "../SavedSearchSettingsModal/SavedSearchSettingsModalContainer";
import SearchResultOnlyDesktopWarning from "../SearchResultOnlyDesktopWarning/SearchResultOnlyDesktopWarning";
import DynamicListInfoSection from "../DynamicListInfoSection/DynamicListInfoSection";
import SearchResultsTable from "../SearchResultsTable/SearchResultsTable";
import SearchFilters from "../SearchFilters/SearchFilters";
import { StyledListSettingsButton } from "pages/sales-intelligence/pages/opportunity-list/styles";
import { DYNAMIC_LIST_PAGE_ROUTE, MY_LISTS_PAGE_ROUTE } from "../../../../constants/routes";
import { StyledSavedSearchesDropdown } from "../SavedSearchesDropdown/styles";
import {
    StyledDynamicListPage,
    StyledDynamicListFilters,
    StyledDynamicListOnlyDesktopWarning,
    StyledDynamicListTableContainer,
} from "./styles";
import { getSearchId, isDesktopQuery } from "../../helpers";

type DynamicListPageProps = {
    fallbackRoute: string;
    searchObject: SavedSearchType;
    savedSearches: SavedSearchType[];
    navigator: WithSWNavigatorProps["navigator"];
    toggleSearchSettingModal(open: boolean): void;
};

const DynamicListPage = (props: DynamicListPageProps) => {
    const { navigator, searchObject, savedSearches, toggleSearchSettingModal } = props;
    const onlyDesktopResults = isDesktopQuery(searchObject.queryDefinition);

    // Callbacks
    const navigateToListsPage = React.useCallback(() => {
        navigator.go(MY_LISTS_PAGE_ROUTE);
    }, [navigator]);
    const navigateToAnotherSavedSearch = React.useCallback(
        (savedSearch: SavedSearchType) => {
            navigator.go(DYNAMIC_LIST_PAGE_ROUTE, { id: getSearchId(savedSearch) });
        },
        [navigator],
    );

    return (
        <StyledDynamicListPage>
            <SavedSearchSettingsModalContainer
                savedSearch={searchObject}
                onSavedSearchDelete={navigateToListsPage}
            />
            <TopBar onBackClick={navigateToListsPage}>
                <StyledSavedSearchesDropdown
                    savedSearch={searchObject}
                    savedSearches={savedSearches}
                    onSelect={navigateToAnotherSavedSearch}
                />
                <StyledListSettingsButton>
                    <IconButton
                        type="flat"
                        iconName="settings"
                        onClick={() => toggleSearchSettingModal(true)}
                        dataAutomation="saved-search-header-settings-button"
                    />
                </StyledListSettingsButton>
            </TopBar>
            <DynamicListInfoSection />
            <StyledDynamicListFilters>
                <SearchFilters searchObject={searchObject} />
            </StyledDynamicListFilters>
            {onlyDesktopResults && (
                <StyledDynamicListOnlyDesktopWarning>
                    <SearchResultOnlyDesktopWarning />
                </StyledDynamicListOnlyDesktopWarning>
            )}
            <StyledDynamicListTableContainer>
                <SearchResultsTable withExcelExport searchObject={searchObject} />
            </StyledDynamicListTableContainer>
        </StyledDynamicListPage>
    );
};

export default DynamicListPage;
