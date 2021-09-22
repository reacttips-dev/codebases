import React from "react";
// eslint-disable-next-line max-len
import { SimilarSitesPanelButtonContainer } from "pages/sales-intelligence/sub-modules/right-sidebar/components/SimilarSitesPanelButton/SimilarSitesPanelButtonContainer";
import { SimilarSiteType } from "pages/sales-intelligence/sub-modules/right-sidebar/types/similar-sites";
import CategoriesSwitch from "../CategoriesSwitch/CategoriesSwitch";
import { BenchmarksMode } from "../../constants";
import { StyledCategoriesSection } from "./styles";

type CategoriesSectionProps = {
    selectedDomain: string;
    selectedMode: BenchmarksMode;
    selectedCategory: string;
    categories: string[];
    onCategorySelect(category: string): void;
    similarSites: SimilarSiteType[];
    similarSitesFetching: boolean;
    onSimilarSitesButtonClick(): void;
};

const CategoriesSection = (props: CategoriesSectionProps) => {
    const {
        selectedMode,
        selectedDomain,
        selectedCategory,
        categories,
        onCategorySelect,
        similarSites,
        similarSitesFetching,
        onSimilarSitesButtonClick,
    } = props;

    if (!selectedCategory) {
        return null;
    }

    return (
        <StyledCategoriesSection>
            <SimilarSitesPanelButtonContainer
                domain={selectedDomain}
                onClick={onSimilarSitesButtonClick}
                isLoading={similarSitesFetching}
                numberOfSites={similarSites.length}
            />
            <CategoriesSwitch
                categories={categories}
                selectedMode={selectedMode}
                selectedCategory={selectedCategory}
                onCategorySelect={onCategorySelect}
            />
        </StyledCategoriesSection>
    );
};

export default CategoriesSection;
