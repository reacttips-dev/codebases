import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { RootState } from "store/types";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import {
    DYNAMIC_LIST_PAGE_ROUTE,
    NEW_DYNAMIC_LIST_SEARCH_ROUTE,
} from "../../../../constants/routes";
import ListsSectionLoader from "pages/sales-intelligence/pages/my-lists/components/ListsSection/ListsSectionLoader";
import { selectSortedSavedSearches } from "../../store/selectors";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { selectLegacyWorkspacesFetching } from "../../../common/store/selectors";
import useTargetAccountsTrackingService from "../../../../hooks/useTargetAccountsTrackingService";
import { getSearchId, getSearchResultCount } from "../../helpers";
import { SavedSearchType } from "../../types";
import SavedSearchesList from "./SavedSearchesList";
import NewSearchButton from "../NewSearchButton/NewSearchButton";
import SavedSearchesListEmpty from "../SavedSearchesListEmpty/SavedSearchesListEmpty";

type SavedSearchesListContainerProps = ReturnType<typeof mapStateToProps> & WithSWNavigatorProps;

const SavedSearchesListContainer = (props: SavedSearchesListContainerProps) => {
    const { navigator, isLoading, savedSearches } = props;
    const translate = useTranslation();
    const trackingService = useTargetAccountsTrackingService();
    const sectionName = translate("si.pages.my_lists.section.saved_searches.title");

    const handleItemClick = (item: SavedSearchType) => {
        trackingService.trackSavedSearchClicked(getSearchResultCount(item));
        navigator.go(DYNAMIC_LIST_PAGE_ROUTE, { id: getSearchId(item) });
    };

    const handleNewSearchClick = () => {
        trackingService.trackNewSearchClicked();
        navigator.go(NEW_DYNAMIC_LIST_SEARCH_ROUTE);
    };

    const renderNewSearchButton = () => {
        return <NewSearchButton onClick={handleNewSearchClick} />;
    };

    if (isLoading && savedSearches.length === 0) {
        return <ListsSectionLoader />;
    }

    if (savedSearches.length === 0) {
        return (
            <SavedSearchesListEmpty
                name={sectionName}
                renderNewSearchButton={renderNewSearchButton}
            />
        );
    }

    return (
        <SavedSearchesList
            sectionName={sectionName}
            savedSearches={savedSearches}
            onItemClick={handleItemClick}
            renderAddButton={renderNewSearchButton}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    savedSearches: selectSortedSavedSearches(state),
    isLoading: selectLegacyWorkspacesFetching(state),
});

export default compose(
    connect(mapStateToProps),
    withSWNavigator,
)(SavedSearchesListContainer) as React.FC<{}>;
