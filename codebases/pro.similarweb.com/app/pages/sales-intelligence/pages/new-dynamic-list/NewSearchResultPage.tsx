import React from "react";
import SearchResultsPage from "../../sub-modules/saved-searches/components/SearchResultsPage/SearchResultsPage";
import { NotSavedSearchType } from "../../sub-modules/saved-searches/types";

export type NewSearchResultPageProps = {
    searchObject: NotSavedSearchType;
    toggleSaveSearchModal(isOpen: boolean): void;
};

const NewSearchResultPage = (props: NewSearchResultPageProps) => {
    return <SearchResultsPage saveSearchButtonShown {...props} />;
};

export default NewSearchResultPage;
