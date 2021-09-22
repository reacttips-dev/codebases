import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { FunctionComponent, useRef, useState, useMemo } from "react";
import * as React from "react";
import { CategoriesListManager, CategorySelectionState } from "./CategoriesListManager";
import {
    FooterButton,
    DropdownItem,
} from "components/MultiCategoriesChipDown/src/MultiCategoryChipdownStyles";
import { IMultiCategoriesChipDownProps } from "components/MultiCategoriesChipDown/src/MultiCategoriesChipdownTypes";
import I18n from "components/React/Filters/I18n";

export const MultiCategoriesChipDown: FunctionComponent<IMultiCategoriesChipDownProps> = ({
    initialSelectedCategories,
    categories,
    onDone,
    buttonText,
    searchPlaceholder,
    ignoreParentOnSelect = true,
}) => {
    const [categoriesListManager, setCategoriesListManager] = useState(
        new CategoriesListManager(categories, initialSelectedCategories),
    );
    const [selectedCategories, setSelectedCategories] = useState(
        categoriesListManager.getSelectedCategories(),
    );
    const [showApplyButton, setShowApplyButton] = useState(false);
    const selectedCategoriesTooltip = useMemo(() => {
        return selectedCategories
            .filter((cat) => !cat.sons || cat.sons.length === 0)
            .map(({ name }) => name)
            .join(", ");
    }, [selectedCategories]);

    const selectedCategoriesChipText = useMemo(() => {
        const selectedChildCategories = selectedCategories.filter(
            (cat) => !cat.sons || cat.sons.length === 0,
        );

        if (selectedChildCategories.length <= 0) {
            return null;
        }

        // We check if we have parent categories selected. in case a parent
        // category was selected, we want prioritize its name as the selected chip text
        // and add (+ num) next to its name as an indicator of the amount of child categories
        // selected. (this is a product decision)
        const selectedParentCategory = selectedCategories.find(
            (cat) => cat.sons && cat.sons.length > 0,
        );

        if (selectedParentCategory) {
            return `${selectedParentCategory.name} + ${selectedChildCategories.length}`;
        }

        // otherwise - we take the name of the first selected child category as an arbritrary choice
        // and add + (num) in case more than one child category was selected (this is a product decision)
        const [firstSelectedChild, ...rest] = selectedChildCategories;
        return `${firstSelectedChild.name}${rest.length > 0 ? ` + ${rest.length}` : ``}`;
    }, [selectedCategories]);

    const selectedCategoryIds = useMemo(() => {
        return selectedCategories.reduce((res, { id, selected }) => {
            if (selected === CategorySelectionState.FULL) {
                res[id] = true;
            }
            return res;
        }, {});
    }, [selectedCategories]);

    const flattenCategories = useMemo(() => {
        return categories.reduce((result, current) => {
            const { sons, ...rest } = current;
            result.push(rest);
            if (sons && sons.length > 0) {
                result.push(...sons);
            }
            return result;
        }, []);
    }, []);

    const onClick = (category) => {
        // sub-category
        if (category.parentId) {
            categoriesListManager.toggleSubCategory(category.id);
        }
        // parent category
        else {
            categoriesListManager.toggleParentCategory(category.id);
        }

        const selected = categoriesListManager.getSelectedCategories();
        setSelectedCategories(selected);

        // display the "aplly changes" button only in case we have some selected
        // categories.
        const hasSelectedCategories = selected && selected.length > 0;
        setShowApplyButton(hasSelectedCategories);
    };

    const onToggle = (isOpen) => {
        if (!isOpen) {
            // reset to initial selected categories
            categoriesListManager.reset();
            setSelectedCategories(categoriesListManager.getSelectedCategories());
            setShowApplyButton(false);
        }
    };

    const onClose = () => {
        categoriesListManager.clear();
        setSelectedCategories([]);
        onDone([]);
    };

    const onApply = () => {
        const selectedCategories = categoriesListManager.getSelectedCategories(
            true,
            ignoreParentOnSelect,
        );
        onDone(selectedCategories);
        setCategoriesListManager(
            new CategoriesListManager(
                categories,
                selectedCategories.map(({ id }) => id),
            ),
        );
        chipDownRef?.current?.closePopup();
    };
    const chipDownRef = useRef(undefined);

    return (
        <ChipDownContainer
            ref={chipDownRef}
            tooltipDisabled={selectedCategories.length === 1}
            selectedText={selectedCategoriesChipText}
            tooltipText={selectedCategoriesTooltip}
            selectedIds={selectedCategoryIds}
            hasSearch={true}
            closeOnItemClick={false}
            onToggle={onToggle}
            onClick={onClick}
            onCloseItem={onClose}
            width={420}
            buttonText={buttonText}
            searchPlaceHolder={searchPlaceholder}
            footerComponent={() =>
                showApplyButton && (
                    <FooterButton onClick={onApply}>
                        <I18n>common.apply</I18n>
                    </FooterButton>
                )
            }
            cssClassContainer="DropdownContent-container"
        >
            {flattenCategories.map((category) => {
                const parentCategory = selectedCategories.find(({ id }) => id === category.id);
                const isPartiallySelected =
                    parentCategory && parentCategory.selected === CategorySelectionState.PARTIAL;
                return (
                    <DropdownItem
                        key={Date.now()}
                        id={category.id}
                        icon={category.icon}
                        name={category.name}
                        isChild={category.isChild}
                        parentId={category.parentId}
                        text={`${category.name} ${category.count > 0 ? `(${category.count})` : ``}`}
                        partiallySelected={isPartiallySelected}
                    />
                );
            })}
        </ChipDownContainer>
    );
};

MultiCategoriesChipDown.defaultProps = {
    initialSelectedCategories: [],
};
