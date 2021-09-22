import * as React from "react";
import { StatelessComponent } from "react";
import {
    abbrNumberVisitsFilter,
    decimalNumberFilter,
    percentageSignFilter,
    timeFilter,
} from "../../../../app/filters/ngFilters";
import { TrackWithGuidService } from "../../../../app/services/track/TrackWithGuidService";
import AllContexts from "../../conversion/components/AllContexts";
import { ITab, ITabs } from "./graphWithTabs";
import { IndustryAnalysisGeographyGraphWithTabs } from "./IndustryAnalysisGeographyGraphWithTabs";
import { GeoContainer } from "./StyledComponents";

export interface IIndustryAnalysisGeographyProps {
    pageFilters?: any;
    loading: boolean;
    tableData?: any;
    tableExcelUrl: string;
    graphData?: any;
    translate: (key: string) => string;
    track: (a?, b?, c?, d?) => void;
    durationDataForWidget: string[];
    getLink: (a, b?, c?) => string;
    selectedRows: any;
    components: any;
    countryTextByIdFilter: () => (val, na?: any) => string;
}

export interface IGeographyVerticals extends ITabs {
    Visits: ITab;
    PagesPerVisit: ITab;
    TimePerVisit: ITab;
    BounceRate: ITab;
    Growth: ITab;
}

export const GeoVerticals: IGeographyVerticals = {
    Visits: {
        title: "industry.analysis.geo.tab.visits",
        dataKey: "Visits",
        filter: [abbrNumberVisitsFilter, 1],
        name: "Visits",
    },
    Growth: {
        title: "industry.analysis.geo.tab.growth",
        dataKey: "Growth",
        filter: [percentageSignFilter, 2],
        name: "Growth",
    },
    PagesPerVisit: {
        title: "industry.analysis.geo.tab.ppv",
        dataKey: "PagesPerVisit",
        filter: [decimalNumberFilter],
        name: "PagesPerVisit",
    },
    TimePerVisit: {
        title: "industry.analysis.geo.tab.timepervisit",
        dataKey: "TimePerVisit",
        filter: [timeFilter],
        name: "TimePerVisit",
    },
    BounceRate: {
        title: "industry.analysis.geo.tab.bouncerate",
        dataKey: "BounceRate",
        filter: [decimalNumberFilter],
        name: "BounceRate",
    },
};

export const IndustryAnalysisGeography: StatelessComponent<IIndustryAnalysisGeographyProps> = ({
    translate,
    track,
    graphData,
    tableData,
    loading,
    pageFilters,
    durationDataForWidget,
    tableExcelUrl,
    getLink,
    selectedRows,
    components,
    countryTextByIdFilter,
}) => {
    const industryAnalysisGeoChartProps = {
        title: "industry.analysis.geo.overtime.graph.title",
        titleTooltip: "industry.analysis.geo.overtime.graph.title.tooltip",
        filters: pageFilters,
        // data: graphData,
        data: graphData,
        isLoading: loading,
        durationDataForWidget,
        tabs: GeoVerticals,
        selectedRows,
        rowSelectionProp: "Country",
        countryTextByIdFilter,
    };

    const tableProps = {
        isLoading: loading,
        tableData,
        tableExcelUrl,
        selectedRows,
        tableSelectionKey: "IndustryAnalysisGeoTable",
        tableSelectionProperty: "Country",
        countryTextByIdFilter,
    };
    const { IndustryAnalysisGeographyTableContainer } = components;
    return (
        <AllContexts
            translate={translate}
            track={track}
            filters={pageFilters}
            linkFn={getLink}
            trackWithGuid={TrackWithGuidService.trackWithGuid}
        >
            <GeoContainer>
                <IndustryAnalysisGeographyGraphWithTabs {...industryAnalysisGeoChartProps} />
                <IndustryAnalysisGeographyTableContainer {...tableProps} />
            </GeoContainer>
        </AllContexts>
    );
};
