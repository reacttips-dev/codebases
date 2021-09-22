import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import DropdownEmptyItem from "pages/sales-intelligence/common-components/dropdown/DropdownEmptyItem/DropdownEmptyItem";
import { StyledListsDropdownContent } from "pages/sales-intelligence/pages/opportunity-list/components/lists-dropdown/ListsDropdownContent/styles";
import ScrollableDropdownContainer from "pages/workspace/sales/components/custom-dropdown/ScrollableDropdownContainer/ScrollableDropdownContainer";
import SavedSearchesDropdownItem from "pages/sales-intelligence/sub-modules/saved-searches/components/SavedSearchesDropdown/SavedSearchesDropdownItem";
import { getSearchId, getSearchName } from "../../helpers";
import { SavedSearchType } from "../../types";

type SavedSearchesDropdownContentProps = {
    search: string;
    isOpen: boolean;
    selectedSearch: SavedSearchType;
    savedSearches: SavedSearchType[];
    setDropdownScrollAreaRef?: React.LegacyRef<ScrollArea>;
    onSearch(q: string): void;
    onSelect(savedSearch: SavedSearchType): void;
};

const SCROLL_AREA_STYLES: React.CSSProperties = { maxHeight: 225 };
const SavedSearchesDropdownContent = (props: SavedSearchesDropdownContentProps) => {
    const translate = useTranslation();
    const {
        search,
        isOpen,
        onSearch,
        onSelect,
        savedSearches,
        selectedSearch,
        setDropdownScrollAreaRef,
    } = props;
    // Memo
    const searchProps = React.useMemo(() => {
        return {
            value: search,
            onChange: onSearch,
            placeholder: translate("si.components.lists_dropdown.placeholder"),
        };
    }, [search, onSearch, translate]);
    // Callbacks
    const withoutSelectedSearch = React.useCallback(
        (search: SavedSearchType) => {
            return getSearchId(selectedSearch) !== getSearchId(search);
        },
        [selectedSearch],
    );
    const withMatchingSearch = React.useCallback(
        (savedSearch: SavedSearchType) => {
            return getSearchName(savedSearch).toLowerCase().includes(search.toLowerCase());
        },
        [search],
    );

    const filteredSearches = savedSearches.filter(withoutSelectedSearch).filter(withMatchingSearch);

    return (
        <StyledListsDropdownContent includesSearch searchProps={searchProps} open={isOpen}>
            <ScrollableDropdownContainer
                scrollAreaStyle={SCROLL_AREA_STYLES}
                setScrollAreaRef={setDropdownScrollAreaRef}
            >
                {filteredSearches.map((search) => (
                    <SavedSearchesDropdownItem
                        onClick={onSelect}
                        savedSearch={search}
                        key={getSearchId(search)}
                    />
                ))}
                {filteredSearches.length === 0 && (
                    <DropdownEmptyItem
                        text={translate("si.components.saved_searches_dropdown.empty_text")}
                    />
                )}
            </ScrollableDropdownContainer>
        </StyledListsDropdownContent>
    );
};

export default SavedSearchesDropdownContent;
