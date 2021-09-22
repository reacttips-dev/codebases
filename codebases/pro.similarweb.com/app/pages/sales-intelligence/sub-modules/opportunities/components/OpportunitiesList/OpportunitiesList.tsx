import React from "react";
import { OpportunityListType } from "../../types";
import ListsSection from "pages/sales-intelligence/pages/my-lists/components/ListsSection/ListsSection";
import OpportunityListItem from "../OpportunityListItem/OpportunityListItem";

type OpportunitiesListProps = {
    sectionName: string;
    opportunityLists: OpportunityListType[];
    onItemClick(item: OpportunityListType): void;
    renderAddButton(): React.ReactNode;
};

const OpportunitiesList = (props: OpportunitiesListProps) => {
    const { sectionName, opportunityLists, onItemClick, renderAddButton } = props;

    return (
        <ListsSection
            includesQuota
            name={sectionName}
            onItemClick={onItemClick}
            items={opportunityLists}
            ListItemComponent={OpportunityListItem}
            dataAutomation="si-static-lists-section"
            renderActionComponent={renderAddButton}
            extractId={(list: OpportunityListType) => list.opportunityListId}
        />
    );
};

export default OpportunitiesList;
