import React from "react";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useKeywordCompetitorsPageContext } from "pages/website-analysis/keyword-competitors/KeywordCompetitorsPageContext";
import utils from "Shared/utils";
import {
    categoryClassIconFilter,
    i18nCategoryFilter,
    i18nFilter,
    subCategoryFilter,
} from "filters/ngFilters";
import styled from "styled-components";
import { CategoryItem } from "components/React/CategoriesDropdown/CategoryDropdown";

const i18nCategory = i18nCategoryFilter();
const categoryClassIcon = categoryClassIconFilter();
const subCategory = subCategoryFilter();
const i18n = i18nFilter();

const convertCategory = ({ Count, Name, Sons = [], id }, parentId = null) => {
    const text = `${i18nCategory(Name)}${Count ? ` (${Count})` : ``}`;
    return {
        text,
        id,
        isCustomCategory: false,
        isChild: Sons.length === 0,
        icon: categoryClassIcon(id),
        forApi: `${parentId ? `${parentId}~` : ``}${id}`,
    };
};

const CategoryItemContainer = styled(CategoryItem)`
    font-weight: 400;
`;

export const CategoryFilter: React.FC = () => {
    const {
        selectedCategory,
        onSelectCategory,
        allCategories,
    } = useKeywordCompetitorsPageContext();
    if (allCategories?.length === 0) {
        return null;
    }
    const getCategoriesOptions = () => {
        const categories = utils.manipulateCategories(allCategories);
        const items = categories.reduce((result, category) => {
            if (category.Sons.length > 0) {
                return [
                    ...result,
                    convertCategory(category),
                    ...category.Sons.map((son) => convertCategory(son, category.id)),
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

    const selectedText = selectedCategory ? subCategory(selectedCategory) : "";
    return (
        <ChipDownContainer
            width={340}
            onClick={onSelectCategory}
            selectedText={selectedText}
            onCloseItem={() => onSelectCategory(null)}
            buttonText={i18n("common.category.all")}
            searchPlaceHolder={i18n("industry.filter.search")}
            tooltipDisabled={true}
            hasSearch={true}
        >
            {getCategoriesOptions()}
        </ChipDownContainer>
    );
};
