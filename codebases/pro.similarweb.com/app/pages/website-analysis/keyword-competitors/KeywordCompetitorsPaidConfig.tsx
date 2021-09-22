import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";
import { Connected } from "./KeywordCompetitorsPage";

export const searchTypes = [
    {
        id: null,
        text: "analysis.competitors.search.paid.table.searchtype.all",
        tooltipText: "analysis.competitors.search.paid.table.searchtype.all.tooltip",
    },
    {
        id: "IsPpc",
        text: "analysis.competitors.search.paid.table.searchtype.searchads",
        tooltipText: "analysis.competitors.search.paid.table.searchtype.searchads.tooltip",
    },
    {
        id: "IsPla",
        text: "analysis.competitors.search.paid.table.searchtype.pla",
        tooltipText: "analysis.competitors.search.paid.table.searchtype.pla.tooltip",
    },
];

const KeywordCompetitorsPaidPage = () => {
    const tabMetaData = {
        isPaid: true,
        tableApi: `/widgetApi/SearchCompetitors/SearchCompetitorsPaid/Table`,
        excelApi: `/widgetApi/SearchCompetitors/SearchCompetitorsPaid/Excel`,
        i18nPrefix: `analysis.competitors.search.paid.table`,
        metric: `KeywordCompetitorsPaidTable`,
        tableSelectionTracking: `Keyword Competitors Paid`,
        tableSelectionKey: "KeywordCompetitorsPaidTable",
        a2dMetric: `SearchCompetitorsPaid`,
        searchTypeFilterPlaceholder: "analysis.competitors.search.paid.table.filters.searchtype",
        searchTypeParam: "paidSearchType",
        searchTypes,
        title: "analysis.competitors.search.paid.title",
    };
    return <Connected tabMetaData={tabMetaData} />;
};

export const Paid = SWReactRootComponent(KeywordCompetitorsPaidPage, "KeywordCompetitorsPaidPage");
