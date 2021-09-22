import { FC } from "react";
import SearchCompetitorsWidgetFilters from "./SearchCompetitorsWidgetFilters";
import { searchTypes } from "pages/website-analysis/keyword-competitors/KeywordCompetitorsPaidConfig";

const PaidSearchCompetitorsWidgetFilters: any = (props) => {
    return <SearchCompetitorsWidgetFilters {...props} searchTypes={searchTypes} />;
};

export default PaidSearchCompetitorsWidgetFilters;
