import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";
import { Connected } from "./KeywordCompetitorsPage";

export const searchTypes = [
    {
        id: null,
        text: "analysis.competitors.search.organic.table.searchtype.all",
        tooltipText: "analysis.competitors.search.organic.table.searchtype.all.tooltip",
    },
    {
        id: "IsRelatedQuestions",
        text: "analysis.competitors.search.organic.table.searchtype.questions",
        tooltipText: "analysis.competitors.search.organic.table.searchtype.questions.tooltip",
    },
    {
        id: "IsNews",
        text: "analysis.competitors.search.organic.table.searchtype.news",
        tooltipText: "analysis.competitors.search.organic.table.searchtype.news.tooltip",
    },
];

const KeywordCompetitorsOrganicPage = () => {
    const tabMetaData = {
        tableApi: `/widgetApi/SearchCompetitors/SearchCompetitorsOrganic/Table`,
        excelApi: `/widgetApi/SearchCompetitors/SearchCompetitorsOrganic/Excel`,
        i18nPrefix: `analysis.competitors.search.organic.table`,
        metric: `KeywordCompetitorsOrganicTable`,
        tableSelectionTracking: `Keyword Competitors Organic`,
        tableSelectionKey: "KeywordCompetitorsOrganicTable",
        a2dMetric: `SearchCompetitorsOrganic`,
        searchTypeFilterPlaceholder: "analysis.competitors.search.organic.table.filters.searchtype",
        searchTypeParam: "organicSearchType",
        searchTypes,
        title: "analysis.competitors.search.organic.title",
    };
    return <Connected tabMetaData={tabMetaData} />;
};

export const Organic = SWReactRootComponent(
    KeywordCompetitorsOrganicPage,
    "KeywordCompetitorsOrganicPage",
);
