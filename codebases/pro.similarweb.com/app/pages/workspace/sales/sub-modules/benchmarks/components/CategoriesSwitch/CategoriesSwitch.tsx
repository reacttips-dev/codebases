import React from "react";
import { Switcher, TextSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { BenchmarksMode } from "../../constants";
import { StyledCategoriesSwitch } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";

type CategoriesSwitchProps = {
    categories: string[];
    selectedCategory: string;
    selectedMode: BenchmarksMode;
    className?: string;
    onCategorySelect(category: string): void;
};

const CategoriesSwitch = (props: CategoriesSwitchProps) => {
    const translate = useTranslation();
    const { selectedCategory, categories, onCategorySelect, className = null } = props;
    const selectedIndex = categories.indexOf(selectedCategory);

    const handleCategorySwitch = (index: number) => {
        onCategorySelect(categories[index]);
    };

    return (
        <StyledCategoriesSwitch className={className}>
            <Switcher selectedIndex={selectedIndex} onItemClick={handleCategorySwitch}>
                {categories.map((category) => (
                    <TextSwitcherItem key={category}>
                        <span>{translate(`si.insights.type.${category}`)}</span>
                    </TextSwitcherItem>
                ))}
            </Switcher>
        </StyledCategoriesSwitch>
    );
};

export default CategoriesSwitch;
