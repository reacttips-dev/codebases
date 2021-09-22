import React from "react";
import { useSalesSettingsHelper } from "../../../../services/salesSettingsHelper";
import { NotSavedSearchType } from "../../types";
import { isDesktopQuery } from "../../helpers";
import SearchResultsLimitTopTrialBanner from "../trial-banners/SearchResultsLimitTopTrialBanner";
import NotSavedSearchHeader from "../NotSavedSearchHeader/NotSavedSearchHeader";
import SearchFilters from "../SearchFilters/SearchFilters";
import SearchLegend from "../SearchLegend/SearchLegend";
import SearchResultOnlyDesktopWarning from "../SearchResultOnlyDesktopWarning/SearchResultOnlyDesktopWarning";
import SearchResultsTable from "../SearchResultsTable/SearchResultsTable";
import SearchResultsLimitBottomTrialBanner from "../trial-banners/SearchResultsLimitBottomTrialBanner";
import NewSavedSearchModalContainer from "../NewSavedSearchModal/NewSavedSearchModalContainer";
import { StyledSearchResultsPage, StyledSearchResultsPageFilters } from "./styles";
import { StyledSearchResultPageContainer } from "../styles";

type SearchResultsPageProps = {
    withExcelExport?: boolean;
    saveSearchButtonShown?: boolean;
    searchObject: NotSavedSearchType;
    onExcelDownloadSuccess?(): void;
    toggleSaveSearchModal(isOpen: boolean): void;
};

const SearchResultsPage = (props: SearchResultsPageProps) => {
    const {
        searchObject,
        toggleSaveSearchModal,
        withExcelExport = false,
        saveSearchButtonShown = false,
        onExcelDownloadSuccess,
    } = props;
    const salesSettingsHelper = useSalesSettingsHelper();
    const searchResultsLimit = salesSettingsHelper.getSearchResultsLimit();
    const limitedSearchResults = salesSettingsHelper.areSearchResultsLimited();
    const onlyDesktopResults = isDesktopQuery(searchObject.queryDefinition);

    // Callbacks
    const onSaveSearchButtonClick = React.useCallback(() => {
        toggleSaveSearchModal(true);
    }, [toggleSaveSearchModal]);
    const goBack = React.useCallback(() => {
        window.history.back();
    }, []);

    return (
        <StyledSearchResultsPage>
            <SearchLegend currentStep={1} onClickBack={goBack} />
            <StyledSearchResultPageContainer>
                {limitedSearchResults && (
                    <SearchResultsLimitTopTrialBanner resultsLimit={searchResultsLimit} />
                )}
                <NotSavedSearchHeader />
                <StyledSearchResultsPageFilters>
                    <SearchFilters
                        searchObject={searchObject}
                        onSaveSearchClick={
                            saveSearchButtonShown ? onSaveSearchButtonClick : undefined
                        }
                    />
                </StyledSearchResultsPageFilters>
                {onlyDesktopResults && <SearchResultOnlyDesktopWarning />}
                <SearchResultsTable
                    searchObject={searchObject}
                    withExcelExport={withExcelExport}
                    onExcelDownloadSuccess={onExcelDownloadSuccess}
                />
                {limitedSearchResults && (
                    <SearchResultsLimitBottomTrialBanner resultsLimit={searchResultsLimit} />
                )}
            </StyledSearchResultPageContainer>
            <NewSavedSearchModalContainer searchObject={searchObject} />
        </StyledSearchResultsPage>
    );
};

export default SearchResultsPage;
