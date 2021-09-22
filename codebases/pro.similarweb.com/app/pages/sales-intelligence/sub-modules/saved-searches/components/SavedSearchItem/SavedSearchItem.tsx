import React from "react";
import { SavedSearchType } from "../../types";
import { getSearchName, getSearchResultCount } from "../../helpers";
import SalesListItem from "../../../../common-components/sales-list-item/SalesListItem";

type SavedSearchItemProps = {
    item: SavedSearchType;
    onClick(item: SavedSearchType): void;
};

const SavedSearchItem = (props: SavedSearchItemProps) => {
    const { item, onClick } = props;

    const handleItemLick = () => {
        onClick(item);
    };

    return (
        <SalesListItem
            onClick={handleItemLick}
            iconName="toggle-filters"
            name={getSearchName(item)}
            dataAutomation="si-dynamic-list-item"
            numberOfWebsites={getSearchResultCount(item)}
        />
    );
};

export default SavedSearchItem;
