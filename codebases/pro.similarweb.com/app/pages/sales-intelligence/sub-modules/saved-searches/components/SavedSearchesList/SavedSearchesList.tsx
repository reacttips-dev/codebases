import React from "react";
import ListsSection from "pages/sales-intelligence/pages/my-lists/components/ListsSection/ListsSection";
import { getSearchId } from "../../helpers";
import { SavedSearchType } from "../../types";
import SavedSearchItem from "../SavedSearchItem/SavedSearchItem";

type SavedSearchesListProps = {
    sectionName: string;
    savedSearches: SavedSearchType[];
    onItemClick(item: SavedSearchType): void;
    renderAddButton(): React.ReactNode;
};

const SavedSearchesList = (props: SavedSearchesListProps) => {
    const { sectionName, savedSearches, onItemClick, renderAddButton } = props;

    return (
        <ListsSection
            name={sectionName}
            items={savedSearches}
            extractId={getSearchId}
            onItemClick={onItemClick}
            ListItemComponent={SavedSearchItem}
            renderActionComponent={renderAddButton}
            dataAutomation="si-dynamic-lists-section"
        />
    );
};

export default SavedSearchesList;
