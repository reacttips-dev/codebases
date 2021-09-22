import React from "react";
import { StyledListsDropdownItem, StyledListName, StyledListWebsitesCount } from "./styles";
import { OpportunityListType } from "../../../../../sub-modules/opportunities/types";

type ListsDropdownItemProps = {
    list: OpportunityListType;
    onClick(list: OpportunityListType): void;
};

const ListsDropdownItem = (props: ListsDropdownItemProps) => {
    const { list, onClick } = props;

    return (
        <StyledListsDropdownItem
            onClick={() => onClick(list)}
            data-automation={`si-lists-dropdown-item-${list.opportunityListId}`}
        >
            <StyledListName>
                <span>{list.friendlyName}</span>
            </StyledListName>
            <StyledListWebsitesCount>
                <span>{list.opportunities.length}</span>
            </StyledListWebsitesCount>
        </StyledListsDropdownItem>
    );
};

export default ListsDropdownItem;
