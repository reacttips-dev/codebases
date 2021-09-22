import { FC } from "react";
import SearchCompetitorsWidgetFilters from "./SearchCompetitorsWidgetFilters";
import { searchTypes } from "pages/website-analysis/keyword-competitors/KeywordCompetitorsOrganicConfig";

const OrganicSearchCompetitorsWidgetFilters: any = (props) => {
    return <SearchCompetitorsWidgetFilters {...props} searchTypes={searchTypes} />;
};

export default OrganicSearchCompetitorsWidgetFilters;
