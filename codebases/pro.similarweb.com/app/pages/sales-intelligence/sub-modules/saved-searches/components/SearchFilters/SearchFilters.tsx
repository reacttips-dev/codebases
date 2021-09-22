import React from "react";
import { StyledSearchFilters, StyledSaveSearchButton } from "./styles";
import { NotSavedSearchType, SavedSearchType } from "../../types";
import LeadGeneratorUtils from "pages/lead-generator/LeadGeneratorUtils";
import LeadGeneratorSubtitleBox from "pages/lead-generator/components/LeadGeneratorSubtitleBox";
import SaveNewSearchButton from "pages/workspace/sales/saved-searches/SaveNewSearchButton/SaveNewSearchButton";

type SearchFiltersProps = {
    searchObject: NotSavedSearchType | SavedSearchType;
    onSaveSearchClick?(): void;
};

const SearchFilters = (props: SearchFiltersProps) => {
    const { searchObject, onSaveSearchClick } = props;

    const filters = React.useMemo(() => {
        return LeadGeneratorUtils.getBoxSubtitleFilters(
            null,
            searchObject.queryDefinition.order_by,
            searchObject.queryDefinition.filters,
        );
    }, [searchObject.queryDefinition]);

    return (
        <StyledSearchFilters>
            <LeadGeneratorSubtitleBox filters={filters} />
            {typeof onSaveSearchClick === "function" && (
                <StyledSaveSearchButton>
                    <SaveNewSearchButton onClick={onSaveSearchClick} />
                </StyledSaveSearchButton>
            )}
        </StyledSearchFilters>
    );
};

export default SearchFilters;
