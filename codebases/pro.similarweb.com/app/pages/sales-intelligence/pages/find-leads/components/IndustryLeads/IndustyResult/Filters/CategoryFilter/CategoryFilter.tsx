import React from "react";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { categoryClassIconFilter, i18nCategoryFilter, subCategoryFilter } from "filters/ngFilters";
import styled from "styled-components";
import { CategoryItem } from "components/React/CategoriesDropdown/CategoryDropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useTableContext } from "../../TableContextProvider";

const i18nCategory = i18nCategoryFilter();
const categoryClassIcon = categoryClassIconFilter();
const subCategory = subCategoryFilter();

const convertCategory = ({ count, formattedText, children = [], id }, parentId = null) => {
    const text = `${i18nCategory(formattedText)}${count ? ` (${count})` : ``}`;
    return {
        text,
        id,
        isCustomCategory: false,
        isChild: children.length === 0,
        icon: categoryClassIcon(id),
        forApi: `${id}`,
    };
};

const CategoryItemContainer = styled(CategoryItem)`
    font-weight: 400;
`;

export const CategoryFilter = (): JSX.Element => {
    const { selectedCategory, onSelectCategory, allCategories, isLoading } = useTableContext();
    const translate = useTranslation();

    if (allCategories?.length === 0) {
        return null;
    }

    const getCategoriesOptions = () => {
        const items = allCategories.reduce((result, category) => {
            if (category.children.length > 0) {
                return [
                    ...result,
                    convertCategory(category),
                    ...category.children.map((child) => convertCategory(child, category.id)),
                ];
            } else {
                return [...result, convertCategory(category)];
            }
        }, []);

        return items.map((item, index) => {
            return (
                <CategoryItemContainer
                    {...item}
                    key={index}
                    selected={item.forApi === selectedCategory}
                />
            );
        });
    };

    const handleClick = (item): void => {
        onSelectCategory(item);
    };

    const selectedText = selectedCategory ? subCategory(selectedCategory) : "";

    return (
        <ChipDownContainer
            width={600}
            onClick={handleClick}
            selectedText={selectedText}
            onCloseItem={() => onSelectCategory(null)}
            buttonText={translate("common.category.all")}
            searchPlaceHolder={translate("Search")}
            tooltipDisabled
            hasSearch
            disabled={isLoading}
        >
            {getCategoriesOptions()}
        </ChipDownContainer>
    );
};
