import React from "react";
import { SavedSearchType } from "../../types";
import { getSearchId, getSearchName, getSearchResultCount } from "../../helpers";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    StyledListName,
    StyledListsDropdownItem,
} from "pages/sales-intelligence/pages/opportunity-list/components/lists-dropdown/ListsDropdownItem/styles";
import { StyledDropdownItemNewText, StyledDropDownItemCountText } from "./styles";

type SavedSearchesDropdownItemProps = {
    savedSearch: SavedSearchType;
    onClick(savedSearch: SavedSearchType): void;
};

const SavedSearchesDropdownItem = (props: SavedSearchesDropdownItemProps) => {
    const translate = useTranslation();
    const { savedSearch, onClick } = props;
    const newItemsCount = savedSearch.lastRun.newSinceLastRun;

    return (
        <StyledListsDropdownItem
            onClick={() => onClick(savedSearch)}
            data-automation={`si-saved-searches-dropdown-item-${getSearchId(savedSearch)}`}
        >
            <StyledListName>
                <span>{getSearchName(savedSearch)}</span>
            </StyledListName>
            <StyledDropDownItemCountText>
                {newItemsCount > 0 && (
                    <StyledDropdownItemNewText>
                        {translate("si.components.saved_searches_dropdown.new_text", {
                            numberOfNewResults: newItemsCount,
                        })}
                    </StyledDropdownItemNewText>
                )}
                &nbsp;
                <span>{getSearchResultCount(savedSearch)}</span>
            </StyledDropDownItemCountText>
        </StyledListsDropdownItem>
    );
};

export default SavedSearchesDropdownItem;
