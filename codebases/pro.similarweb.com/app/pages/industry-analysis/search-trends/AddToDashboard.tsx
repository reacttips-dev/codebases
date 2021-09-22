import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import React, { useRef } from "react";
import { addToDashboard as addToDashboardFunction } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import categoryService from "common/services/categoryService";
import { getCategoryDetailsForDashboard } from "pages/industry-analysis/category-share/CategoryShareGraph/utils/CategoryShareGraphUtils";
import { booleanSearchToObject } from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";

export const AddToDashboard = ({ filtersStateObject, params }) => {
    const modalRef = useRef();

    const onClick = () => {
        const { category, BooleanSearchTerms: booleanSearchTermsWithPrefix } = params;
        const { IncludeTerms, ExcludeTerms } = booleanSearchToObject(
            decodeURIComponent(booleanSearchTermsWithPrefix),
        );
        const overrideAddToDashboardParams = {
            ...filtersStateObject,
            key: [getCategoryDetailsForDashboard({ category }, { categoryService })],
            family: "Industry",
        };
        const includeTermsFilter = IncludeTerms && { IncludeTerms };
        const excludeTermsFilter = ExcludeTerms && { ExcludeTerms };
        const {
            IncludeNewKeywords,
            IncludeTrendingKeywords,
            IncludeBranded,
            IncludeNoneBranded,
        } = filtersStateObject;
        const filters = {
            ...includeTermsFilter,
            ...excludeTermsFilter,
            IncludeNewKeywords,
            IncludeTrendingKeywords,
            IncludeBranded,
            IncludeNoneBranded,
        };
        const addToDashboardArgs = {
            metric: "SearchTrends",
            type: "IndustryKeywordsDashboardTable",
            overrideAddToDashboardParams,
            filters,
        };
        modalRef.current = addToDashboardFunction(addToDashboardArgs);
    };
    return <AddToDashboardButton onClick={onClick} modalRef={modalRef} />;
};
