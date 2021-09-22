import React from "react";
import {
    Dropdown,
    IDropDownItem,
    DropdownButton,
    MultiSelectCategoryDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { ICategory } from "common/services/categoryService.types";
import { StyledBaseDropdownButtonWrap, StyledDropdownContainer } from "../../styles";
import { DROPDOWN_POPUP_HEIGHT } from "./styles";

type CategoriesDropdownProps = {
    appendTo?: string;
    buttonText: string;
    items: readonly ICategory[];
    searchPlaceholder: string;
    selectedItems: readonly ICategory["id"][];
    onSelect(category: ICategory): void;
};

const CategoriesDropdown = (props: CategoriesDropdownProps) => {
    const { items, selectedItems, searchPlaceholder, buttonText, onSelect, appendTo } = props;
    const selectedIds = selectedItems.reduce((map, id) => {
        map[id] = true;
        return map;
    }, {});

    const handleSearch = (term: string, item: JSX.Element) => {
        return (item.props as IDropDownItem).text.toLowerCase().includes(term.toLowerCase());
    };

    const renderDDButton = () => {
        return (
            <StyledBaseDropdownButtonWrap key="categories-dropdown-button">
                <DropdownButton>{buttonText}</DropdownButton>
            </StyledBaseDropdownButtonWrap>
        );
    };

    return (
        <StyledDropdownContainer>
            <Dropdown
                hasSearch
                onClick={onSelect}
                appendTo={appendTo}
                closeOnItemClick={false}
                selectedIds={selectedIds}
                searchFilter={handleSearch}
                searchPlaceHolder={searchPlaceholder}
                dropdownPopupPlacement="ontop-left"
                dropdownPopupHeight={DROPDOWN_POPUP_HEIGHT}
            >
                {[renderDDButton()].concat(
                    items.map((category) => (
                        <MultiSelectCategoryDropdownItem key={category.id} {...category} />
                    )),
                )}
            </Dropdown>
        </StyledDropdownContainer>
    );
};

export default CategoriesDropdown;
