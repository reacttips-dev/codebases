import React from "react";
import utils from "Shared/utils";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { convertCategory } from "../../helpers";
import { StyledCategoriesSelector, StyledCategoryItem } from "./styles";

// TODO: Add types.
type CompetitorCustomersCategoriesSelectorProps = {
    allCategories: any[];
    selectedCategory: { id: string; text: string } | null;
    onChange(category: string): void;
};

const CompetitorCustomersCategoriesSelector = (
    props: CompetitorCustomersCategoriesSelectorProps,
) => {
    const translate = useTranslation();
    const { allCategories, selectedCategory, onChange } = props;
    const selectedCategoryId = undefined;

    const handleSelect = React.useCallback(
        (item: any) => {
            onChange(item);
        },
        [onChange],
    );

    const handleReset = React.useCallback(() => {
        onChange(null);
    }, [onChange]);

    const transformedCategories = React.useMemo(() => {
        const categories = utils.manipulateCategories(allCategories);

        return categories.reduce((result, category) => {
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
    }, [allCategories]);

    const renderOptions = React.useCallback(() => {
        return transformedCategories.map((item, index) => {
            return (
                <StyledCategoryItem
                    {...item}
                    key={index}
                    selected={item.forApi === selectedCategoryId}
                />
            );
        });
    }, [transformedCategories, selectedCategoryId]);

    function getSelectedIds() {
        if (!selectedCategory) {
            return {};
        }

        return { [selectedCategory.id]: true };
    }

    function getSelectedText() {
        if (!selectedCategory) {
            return null;
        }

        return selectedCategory.text;
    }

    return (
        <StyledCategoriesSelector>
            <ChipDownContainer
                width={340}
                hasSearch
                tooltipDisabled
                onClick={handleSelect}
                onCloseItem={handleReset}
                selectedIds={getSelectedIds()}
                selectedText={getSelectedText()}
                buttonText={translate("common.category.all")}
                searchPlaceHolder={translate("home.dashboards.wizard.filters.searchCategory")}
            >
                {renderOptions()}
            </ChipDownContainer>
        </StyledCategoriesSelector>
    );
};

export default CompetitorCustomersCategoriesSelector;
