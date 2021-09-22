import * as React from "react";
import { FunctionComponent } from "react";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import { StyledPageTitle } from "../../styled components/StyledPageTitle/src/StyledPageTitle";
import AllContexts from "./components/AllContexts";
import { conversionVerticals } from "./components/benchmarkOvertime/benchmarkOvertime";
import { SitesVsCategoryOvertime } from "./components/benchmarkOvertime/SitesVsCategoryOvertime";
import { ConversionCategoryScatter } from "./components/ConversionScatterChart/ConversionCategoryScatter";
import { ConversionScatterContainer } from "./components/ConversionScatterChart/ConversionScatterContainer";
import { ConversionContainer } from "./StyledComponents";
import { TrackWithGuidService } from "../../../app/services/track/TrackWithGuidService";

export interface IScatterData {
    Data: any[];
    Interval?: {
        units: string;
        startyear: number;
        start: number;
        count: number;
        startdate: string;
        enddate: string;
    };
    Domains?: string[];
}

export interface ICategoryOverviewProps {
    pageFilters?: any;
    loading: boolean;
    data?: any;
    translate: (key: string) => string;
    track: (a?, b?, c?, d?) => void;
    components: any;
    selectedRows: any;
    graphData: any;
    tableData: any;
    segmentsData: ISegmentsData;
    onGraphDDClick: (props) => void;
    onScatterDDClick: (props) => void;
    tableExcelLink: string;
    scatterData: IScatterData;
    getLink: (a, b?, c?) => string;
    getAssetsUrl: (a) => string;
}

export const CategoryOverview: FunctionComponent<ICategoryOverviewProps> = ({
    translate,
    track,
    components,
    loading,
    pageFilters,
    selectedRows,
    graphData,
    onGraphDDClick,
    onScatterDDClick,
    tableExcelLink,
    scatterData,
    getLink,
    tableData,
    getAssetsUrl,
    segmentsData,
}) => {
    const sitesVsCategoryProps = {
        title: "conversion.category.sites.vs.category.title",
        titleTooltip: "conversion.category.sites.vs.category.title.tooltip",
        filters: pageFilters,
        data: graphData,
        selectedRows,
        isLoading: loading,
        onGraphDDClick,
        onScatterDDClick,
        tableExcelLink,
        rowSelectionProp: "SegmentId",
        industryAverageAvailable: true,
        segmentsData,
    };

    const scatterCategoryProps = {
        title: "conversion.category.scatter.title",
        titleTooltip: "conversion.category.sactter.title.tooltip",
        filters: pageFilters,
        data: scatterData,
        segmentsData,
        isLoading: loading,
        ScatterComponent: ConversionCategoryScatter,
        excludeVertical: [conversionVerticals.Stickiness.name],
        benchmarkTitle: "conversion.category.benchmark.title",
        confidenceDisclaimer: "conversion.category.scatter.disclaimer.confidence",
        supportMultiChannel: true,
        getAssetsUrl,
    };

    const tableProps = {
        isLoading: loading,
        tableData,
        selectedRows,
        segmentsData,
        tableSelectionKey: "CategoryConversionTable",
        tableSelectionProperty: "SegmentId",
    };

    const { CategoryConversionTableContainer } = components;
    return (
        <AllContexts
            translate={translate}
            trackWithGuid={TrackWithGuidService.trackWithGuid}
            track={track}
            linkFn={getLink}
        >
            <ConversionContainer>
                <StyledPageTitle data-automation-page-title={true}>
                    {translate("conversion.category.overview.title")}
                </StyledPageTitle>
                <ConversionScatterContainer {...scatterCategoryProps} />
                <SitesVsCategoryOvertime {...sitesVsCategoryProps} />
                <CategoryConversionTableContainer {...tableProps} />
            </ConversionContainer>
        </AllContexts>
    );
};
