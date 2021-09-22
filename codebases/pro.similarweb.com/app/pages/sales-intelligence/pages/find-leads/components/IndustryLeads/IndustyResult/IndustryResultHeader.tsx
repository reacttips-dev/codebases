import React from "react";
import { LeadsNav } from "pages/sales-intelligence/common-components/LeadsHeader/LeadsNav";
import { IndustryAnalysisQueryBar } from "pages/industry-analysis/IndustryAnalysisQueryBar";
import { IndustryAnalysisFilters } from "pages/industry-analysis/IndustryAnalysisFilters";
import { LEAD_ROUTES } from "pages/sales-intelligence/pages/find-leads/constants/routes";
import { SwNavigator } from "common/services/swNavigator";
import { getCategoryDisplayDetails, resolveItemIcon } from "../utils";
import FindLeadsByCriteriaPageHeader from "pages/sales-intelligence/common-components/header/FindLeadsByCriteriaPageHeader/FindLeadsByCriteriaPageHeader";

type IndustryResultHeaderProps = {
    navigator: SwNavigator;
};

const IndustryResultHeader: React.FC<IndustryResultHeaderProps> = ({ navigator }) => {
    const handleClickBack = () => navigator.go(LEAD_ROUTES.INDUSTRY);
    return (
        <>
            <FindLeadsByCriteriaPageHeader step={1} onBackClick={handleClickBack} />
            <LeadsNav
                topLeftComponent={
                    <IndustryAnalysisQueryBar
                        customResolveItemIcon={resolveItemIcon}
                        showOnlyCategories={true}
                        getCategoryDetails={getCategoryDisplayDetails}
                    />
                }
                topRightComponent={<IndustryAnalysisFilters />}
            />
        </>
    );
};

export default IndustryResultHeader;
