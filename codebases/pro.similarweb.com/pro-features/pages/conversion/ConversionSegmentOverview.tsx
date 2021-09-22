import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import { BoxContainer } from "pages/conversion/components/ConversionScatterChart/StyledComponents";
import { ConversionSegmentsUtils } from "pages/conversion/ConversionSegmentsUtils";
import { WebsiteSegmentEmptyState } from "pages/conversion/oss/ConversionSegmentOSS";
import {
    FlexContainerCentered,
    SecondaryText,
    StyledLink,
} from "pages/conversion/oss/ConversionSegmentOSSStyles";
import * as React from "react";
import { FunctionComponent } from "react";
import CountryService from "services/CountryService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { ISegmentsData } from "../../../app/services/conversion/ConversionSegmentsService";
import { StyledPageTitle } from "../../styled components/StyledPageTitle/src/StyledPageTitle";
import AllContexts from "./components/AllContexts";
import { conversionVerticals } from "./components/benchmarkOvertime/benchmarkOvertime";
import { WebsiteConversionOvertime } from "./components/benchmarkOvertime/WebsiteConversionOvertime";
import { ConversionScatterContainer } from "./components/ConversionScatterChart/ConversionScatterContainer";
import { ConversionWebsiteScatter } from "./components/ConversionScatterChart/ConversionWebsiteScatter";
import { MultiLobIndication } from "./MultiLobIndication";
import { ConversionContainer } from "./StyledComponents";

export interface IConversionSegmentOverviewProps {
    pageFilters?: any;
    loading: boolean;
    data?: any;
    translate: (key: string) => string;
    track: (a?, b?, c?, d?) => void;
    graphData: any;
    durationDataForWidget: string[];
    onGraphDDClick: (props) => void;
    onScatterDDClick: (props) => void;
    scatterData: any;
    getLink: (a, b?, c?) => string;
    getAssetsUrl: (a) => string;
    segmentsData: ISegmentsData;
    isSingleLob: boolean;
    overviewSupportedCountries: number[];
}

export const ConversionSegmentOverview: FunctionComponent<IConversionSegmentOverviewProps> = ({
    translate,
    track,
    graphData,
    loading,
    pageFilters,
    durationDataForWidget,
    onGraphDDClick,
    onScatterDDClick,
    scatterData,
    getLink,
    getAssetsUrl,
    isSingleLob,
    segmentsData,
    overviewSupportedCountries,
}) => {
    const swNavigator = Injector.get<any>("swNavigator");
    const websiteConversionOvertimeProps = {
        title: "conversion.website.overtime.graph.title",
        titleTooltip: "conversion.website.overtime.graph.title.tooltip",
        filters: pageFilters,
        data: graphData,
        isLoading: loading,
        durationDataForWidget,
        onGraphDDClick,
        onScatterDDClick,
        rowSelectionProp: "Domain",
        segmentsData,
    };

    const websiteScatterContainerProps = {
        title: "conversion.website.scatter.title",
        titleTooltip: "conversion.website.sactter.title.tooltip",
        filters: pageFilters,
        data: scatterData,
        isLoading: loading,
        excludeVertical: [conversionVerticals.Stickiness.name],
        supportMultiChannel: false,
        ScatterComponent: ConversionWebsiteScatter,
        benchmarkTitle: "conversion.website.benchmark.title",
        confidenceDisclaimer: "conversion.website.scatter.disclaimer.confidence",
        getAssetsUrl,
        segmentsData,
    };

    const renderEmptyState = () => {
        return (
            <BoxContainer data-automation-sites-vs-category={true}>
                <WebsiteSegmentEmptyState
                    primaryText={"conversion.analysis.oss.invalid.country.title"}
                >
                    <FlexContainerCentered>
                        <SecondaryText>
                            {i18nFilter()("conversion.analysis.oss.invalid.country.subtitle")}
                        </SecondaryText>
                        {overviewSupportedCountries.map((country, index) => {
                            if (
                                overviewSupportedCountries.length > 1 &&
                                index === overviewSupportedCountries.length - 1
                            ) {
                                return (
                                    <>
                                        <SecondaryText>
                                            &nbsp;
                                            {i18nFilter()(
                                                "conversion.analysis.oss.invalid.country.subtitle.or",
                                            )}
                                        </SecondaryText>
                                        <StyledLink
                                            key={country}
                                            href={swNavigator.href("conversion-customsegement", {
                                                ...pageFilters,
                                                country,
                                                tab: 0,
                                            })}
                                        >
                                            {CountryService.getCountryById(country).text}
                                        </StyledLink>
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                        {index > 0 &&
                                            index <= overviewSupportedCountries.length - 2 && (
                                                <SecondaryText>,</SecondaryText>
                                            )}
                                        <StyledLink
                                            key={country}
                                            href={swNavigator.href("conversion-customsegement", {
                                                ...pageFilters,
                                                country,
                                                tab: 0,
                                            })}
                                        >
                                            {CountryService.getCountryById(country).text}
                                        </StyledLink>
                                    </>
                                );
                            }
                        })}
                    </FlexContainerCentered>
                </WebsiteSegmentEmptyState>
            </BoxContainer>
        );
    };

    const sector = segmentsData
        ? ConversionSegmentsUtils.getSegmentById(segmentsData, pageFilters.sid).segmentName
        : "";
    return (
        <AllContexts
            translate={translate}
            trackWithGuid={TrackWithGuidService.trackWithGuid}
            track={track}
            linkFn={getLink}
        >
            <ConversionContainer>
                <StyledPageTitle data-automation-page-title={true}>
                    {translate("conversion.website.overview.title")}
                </StyledPageTitle>
                {!isSingleLob && <MultiLobIndication sector={sector} />}
                {overviewSupportedCountries.includes(pageFilters.country) ? (
                    <>
                        <WebsiteConversionOvertime {...websiteConversionOvertimeProps} />
                        <ConversionScatterContainer {...websiteScatterContainerProps} />
                    </>
                ) : (
                    renderEmptyState()
                )}
            </ConversionContainer>
        </AllContexts>
    );
};
