import {
    CategoryDropdownButton,
    CategoryDropdownItem,
    ConfigDropDown,
    CustomCategoryDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import categoryService from "common/services/categoryService";
import PropTypes from "prop-types";
import React, { StatelessComponent } from "react";

export interface ICategoryItem {
    isChild?: boolean;
    text: string;
    id: string;
    isCustomCategory: boolean;
    icon?: string;
}
export const CategoryItem: StatelessComponent<ICategoryItem & { isChild?: boolean }> = (props) => {
    const { text, id, isCustomCategory, isChild = false } = props;
    const CategoryItemComponent = isCustomCategory
        ? CustomCategoryDropdownItem
        : CategoryDropdownItem;
    return (
        <CategoryItemComponent key={id} {...props} isChild={isChild}>
            {text}
        </CategoryItemComponent>
    );
};

export function searchFilter(term, item) {
    return item.props.text.toLowerCase().includes(term.toLowerCase());
}

export const CategoryDropdown: StatelessComponent<any> = ({
    placeHolder,
    selectedCategoryId = "All",
    categories = categoryService.getFlattenedCategoriesList(),
    categoryButtonComponent = CategoryDropdownButton,
    categoryItemComponent = CategoryItem,
    hasSearch = true,
    onSelect,
    ...rest
}) => {
    const items = placeHolder ? [placeHolder, ...categories] : categories;
    return (
        <ConfigDropDown
            shouldScrollToSelected={true}
            hasSearch={true}
            ButtonComponent={categoryButtonComponent}
            ItemComponent={categoryItemComponent}
            items={items}
            searchFilter={searchFilter}
            selectedItemId={selectedCategoryId}
            onClick={onSelect}
            {...rest}
        />
    );
};

CategoryDropdown.propTypes = {
    selectedCategoryId: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    searchFilter: PropTypes.func,
};
CategoryDropdown.defaultProps = {
    buttonWidth: 196,
    dropdownPopupMinScrollHeight: 60,
    dropdownPopupHeight: 180,
    searchFilter,
};
