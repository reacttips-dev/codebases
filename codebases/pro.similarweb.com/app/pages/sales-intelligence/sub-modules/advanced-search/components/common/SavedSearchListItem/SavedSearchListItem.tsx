import React from "react";
import { SimplifiedSavedSearchDto } from "../../../types/common";
import SalesListItem from "pages/sales-intelligence/common-components/sales-list-item/SalesListItem";

type SavedSearchListItemProps<S extends SimplifiedSavedSearchDto> = {
    savedSearch: S;
    iconName?: string;
    onClick(savedSearch: S): void;
};

const SavedSearchListItem = <S extends SimplifiedSavedSearchDto>(
    props: SavedSearchListItemProps<S>,
) => {
    const { savedSearch, iconName = "toggle-filters", onClick } = props;

    const handleItemClick = () => {
        onClick(savedSearch);
    };

    return (
        <SalesListItem
            iconName={iconName}
            name={savedSearch.name}
            onClick={handleItemClick}
            dataAutomation="si-saved-search-item"
            numberOfWebsites={savedSearch.totalNumberOfWebsites}
            numberOfNewWebsites={savedSearch.numberOfNewWebsites}
        />
    );
};

export default SavedSearchListItem;
