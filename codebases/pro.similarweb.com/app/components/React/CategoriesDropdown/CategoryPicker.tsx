import PropTypes from "prop-types";
import React, { StatelessComponent } from "react";
import { i18nFilter } from "../../../filters/ngFilters";
import { CategoryDropdown, ICategoryItem } from "./CategoryDropdown";

interface ICategoryPickerProps {
    placeHolder?: boolean | ICategoryItem;
    selectedCategoryId?: string;
    categories?: ICategoryItem[];
    onSelect(item: ICategoryItem): void;
    onToggle?(isOpen: boolean): void;
    disabled?: boolean;
    searchPlaceHolder?: string;
}

export const CategoryPicker: StatelessComponent<ICategoryPickerProps> = (props) => (
    <CategoryDropdown {...props} />
);
const defaultPlaceHolder = {
    id: "no-category",
    text: i18nFilter()("common.categorypicker.defaultplaceholder.text"),
    isCustomCategory: false,
    isChild: false,
};
CategoryPicker.propTypes = {
    onSelect: PropTypes.func.isRequired,
    placeHolder: PropTypes.oneOfType([PropTypes.bool, PropTypes.any]),
    selectedCategoryId: PropTypes.string,
    categories: PropTypes.array,
    onToggle: PropTypes.func,
    disabled: PropTypes.bool,
    searchPlaceHolder: PropTypes.string,
};

CategoryPicker.defaultProps = {
    placeHolder: defaultPlaceHolder,
    selectedCategoryId: defaultPlaceHolder.id,
};
