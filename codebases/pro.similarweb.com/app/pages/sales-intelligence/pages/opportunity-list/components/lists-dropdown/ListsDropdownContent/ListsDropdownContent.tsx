import React from "react";
import * as styles from "./styles";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { OpportunityListType } from "../../../../../sub-modules/opportunities/types";
import {
    opportunityListDoesNotHaveId,
    opportunityListNameIncludes,
} from "../../../../../sub-modules/opportunities/helpers";
import DropdownEmptyItem from "pages/sales-intelligence/common-components/dropdown/DropdownEmptyItem/DropdownEmptyItem";
import ScrollableDropdownContainer from "pages/workspace/sales/components/custom-dropdown/ScrollableDropdownContainer/ScrollableDropdownContainer";
import ListsDropdownItem from "../ListsDropdownItem/ListsDropdownItem";

type ListsDropdownContentProps = {
    open: boolean;
    search: string;
    lists: OpportunityListType[];
    selectedList: OpportunityListType;
    setDropdownScrollAreaRef?: React.LegacyRef<ScrollArea>;
    onSearch(q: string): void;
    onSelect(list: OpportunityListType): void;
};

const SCROLL_AREA_STYLES: React.CSSProperties = { maxHeight: 225 };
const ListsDropdownContent = (props: ListsDropdownContentProps) => {
    const {
        open,
        search,
        onSearch,
        lists,
        onSelect,
        selectedList,
        setDropdownScrollAreaRef,
    } = props;
    const translate = useTranslation();
    const searchProps = React.useMemo(() => {
        return {
            value: search,
            onChange: onSearch,
            placeholder: translate("si.components.lists_dropdown.placeholder"),
        };
    }, [search, onSearch, translate]);
    const withoutSelectedList = React.useCallback(
        opportunityListDoesNotHaveId(selectedList.opportunityListId),
        [selectedList.opportunityListId],
    );

    const filteredLists = lists
        .filter(withoutSelectedList)
        .filter(opportunityListNameIncludes(search));

    return (
        <styles.StyledListsDropdownContent includesSearch searchProps={searchProps} open={open}>
            <ScrollableDropdownContainer
                scrollAreaStyle={SCROLL_AREA_STYLES}
                setScrollAreaRef={setDropdownScrollAreaRef}
            >
                {filteredLists.map((list) => (
                    <ListsDropdownItem
                        list={list}
                        onClick={onSelect}
                        key={list.opportunityListId}
                    />
                ))}
                {filteredLists.length === 0 && (
                    <DropdownEmptyItem
                        text={translate("si.components.lists_dropdown.empty_text")}
                    />
                )}
            </ScrollableDropdownContainer>
        </styles.StyledListsDropdownContent>
    );
};

export default ListsDropdownContent;
