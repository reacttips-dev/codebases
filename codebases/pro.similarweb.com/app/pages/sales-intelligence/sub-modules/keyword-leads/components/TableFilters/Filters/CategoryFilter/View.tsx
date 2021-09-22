import React from "react";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { CategoryItemContainer } from "../../styles";
import { convertCategory } from "../../../../utils";
import { CategoryType } from "../../../../types";

export const CategoryFilter = ({
    selectedCategory,
    onSelectCategory,
    allCategories,
    isFetching,
}): JSX.Element => {
    const translate = useTranslation();

    if (!allCategories || allCategories.length === 0) {
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

    const handleClick = (category: CategoryType): void => {
        onSelectCategory(category);
    };

    const handleEmpty = (): void => {
        onSelectCategory(null);
    };

    return (
        <ChipDownContainer
            width={340}
            onClick={handleClick}
            selectedText={selectedCategory}
            onCloseItem={handleEmpty}
            buttonText={translate("common.category.all")}
            searchPlaceHolder={translate("si.pages.find_leads.keywords.result.search.placeholder")}
            tooltipDisabled
            hasSearch
            disabled={isFetching}
        >
            {getCategoriesOptions()}
        </ChipDownContainer>
    );
};
