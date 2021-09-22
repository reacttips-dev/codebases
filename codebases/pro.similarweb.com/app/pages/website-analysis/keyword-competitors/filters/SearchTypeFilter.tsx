import { i18nFilter } from "filters/ngFilters";
import React, { useContext } from "react";
import { EllipsisDropdownItem, ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useKeywordCompetitorsPageContext } from "pages/website-analysis/keyword-competitors/KeywordCompetitorsPageContext";
import { GroupCreationDropdownItem } from "components/GroupCreationDropdown/src/GroupCreationDropdownItem";

const i18n = i18nFilter();
export const SearchTypeFilter: React.FC = () => {
    const {
        searchTypes,
        selectedSearchType,
        onSelectSearchType,
        searchTypeFilterPlaceholder,
    } = useKeywordCompetitorsPageContext();
    const items = searchTypes.map((searchType) => {
        return (
            <GroupCreationDropdownItem
                iconName={null}
                title={i18n(searchType.text)}
                key={searchType.text}
                description={i18n(searchType.tooltipText)}
                id={searchType.id}
            />
        );
    });
    const selectedIds = selectedSearchType ? { [selectedSearchType]: true } : {};
    const selectedText = selectedSearchType
        ? i18n(searchTypes.find(({ id }) => id === selectedSearchType).text)
        : null;
    return (
        <ChipDownContainer
            width={280}
            dropdownPopupHeight={1000}
            hasSearch={false}
            selectedIds={selectedIds}
            selectedText={selectedText}
            buttonText={i18n(searchTypeFilterPlaceholder)}
            onClick={onSelectSearchType}
            onCloseItem={() => onSelectSearchType(null)}
        >
            {items}
        </ChipDownContainer>
    );
};
