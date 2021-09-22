import React from "react";
import TrafficTypeChipDropdown from "pages/sales-intelligence/common-components/dropdown/TrafficTypeChipDropdown/TrafficTypeChipDropdown";
import CompetitorCustomersCategoriesSelector from "../CompetitorCustomersCategoriesSelector/CompetitorCustomersCategoriesSelector";
import trafficTypes from "pages/sales-intelligence/pages/find-leads/components/FindCompetitorsSearchSection/traffic-types";
import { TrafficType } from "pages/sales-intelligence/sub-modules/competitor-customers/types";
import { StyledCompetitorCustomersFilters } from "./styles";

// TODO: Add types
type CompetitorCustomersTableFiltersProps = {
    categories: unknown[];
    selectedCategory: any;
    selectedTrafficType: TrafficType;
    onCategorySelect(category: unknown): void;
    onTrafficTypeSelect(type: TrafficType): void;
};

const CompetitorCustomersTableFilters = (props: CompetitorCustomersTableFiltersProps) => {
    const {
        categories,
        selectedCategory,
        onCategorySelect,
        selectedTrafficType,
        onTrafficTypeSelect,
    } = props;

    return (
        <StyledCompetitorCustomersFilters>
            <div>
                <TrafficTypeChipDropdown
                    trafficTypes={trafficTypes}
                    selected={selectedTrafficType}
                    onSelect={onTrafficTypeSelect}
                />
            </div>
            <CompetitorCustomersCategoriesSelector
                allCategories={categories}
                onChange={onCategorySelect}
                selectedCategory={selectedCategory}
            />
        </StyledCompetitorCustomersFilters>
    );
};

export default CompetitorCustomersTableFilters;
