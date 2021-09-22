import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import Chart from "../../../../../.pro-features/components/Chart/src/Chart";
import {
    TitleContainer,
    StyledHeaderTitle,
    ChartContainer,
    ChartAndLegendsWrapper,
    ChartWrapper,
    LoaderContainer,
} from "./StyledComponents";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { ButtonsContainer } from "components/Rule/src/styledComponents";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { PdfExportService } from "services/PdfExportService";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import { getBarChartConfig, multipleDomainsTooltipFormatter } from "./AgeBarChartComparedConfig";
import { CHART_COLORS } from "constants/ChartColors";
import { DemographicsChannelsLegends } from "../DemographicsChannelsLegends";
import { StyledLegendsWrapper } from "../StyledComponents";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";
import { Loader } from "pages/website-analysis/traffic-sources/paid-search/components/common/Loader";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";

interface IAgeDistributionBarChartComparedProps {
    data: any;
    keys: [];
    isLoading?: boolean;
}

export const AgeDistributionBarChartCompared: FunctionComponent<IAgeDistributionBarChartComparedProps> = (
    props,
) => {
    const { data, keys, isLoading = false } = props;

    const services = React.useMemo(
        () => ({
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
        }),
        [],
    );

    const chartRef = useRef<HTMLElement>();
    const params = services.swNavigator.getParams() as any;
    const apiParams = services.swNavigator.getApiParams(params);
    const [isEmpty, setIsEmpty] = useState(true);
    const [graphData, setGraphData] = useState([]); // data (or filtered data) for the chart
    const [fullGraphData, setFullGraphData] = useState([]); // data for the legends

    const lagendToggleHandler = useCallback(
        (filterData) => {
            setGraphData(filterData);
        },
        [graphData],
    );

    // on first load we want to set the chart and legends with the same filtered data.
    useEffect(() => {
        if (!data) return;

        const initGraphData = comparisonColumnChartData();
        setGraphData(initGraphData);
        setFullGraphData(initGraphData);
    }, []);

    const comparisonColumnChartData = useCallback(() => {
        let isEmptyFlag = true;
        return Object.entries(data).map(([site, data], index) => {
            return {
                name: site,
                data: Object.entries(data).map(([bucket, val]) => {
                    if (val && isEmptyFlag) {
                        // this will run only once and change the isEmpty flag if needed
                        isEmptyFlag = false;
                        setIsEmpty(false);
                    }
                    return {
                        key: bucket,
                        color: CHART_COLORS.chartMainColors[index],
                        isSite: true,
                        opacity: 1,
                        y: val,
                        dataLabels: {
                            enabled: true,
                        },
                    };
                }),
            };
        });
    }, [graphData]);

    const getPNG = React.useCallback(() => {
        TrackWithGuidService.trackWithGuid("Age_Distribution.png", "submit-ok", {
            type: "PNG",
        });
        const offSetX = 0;
        const offSetY = 50;
        const fileName = `Website Analysis Age-Distribution-(${apiParams.key})-(from: ${apiParams.from})-(to: ${apiParams.to})`;
        const styleHTML = Array.from(document.querySelectorAll("style"))
            .map((stylesheet) => stylesheet.outerHTML)
            .join("");
        PdfExportService.downloadHtmlPngFedService(
            styleHTML + chartRef.current.outerHTML,
            fileName,
            chartRef.current.offsetWidth + offSetX,
            chartRef.current.offsetHeight + offSetY,
        );
    }, [chartRef]);

    useEffect(() => {
        return cleanDashboardModal;
    }, []);
    const A2DRef = useRef() as any;
    const cleanDashboardModal = () => {
        A2DRef?.current?.dismiss();
    };
    const a2d = () => {
        A2DRef.current = addToDashboard({
            webSource: "Total",
            modelType: "fromWebsite",
            metric: "WebDemographicsAge",
            type: "BarChartDemographics",
        });
    };

    const getUtilityButtons = () => {
        return (
            <ButtonsContainer>
                <DownloadButtonMenu PNG={true} exportFunction={getPNG} />
                <AddToDashboardButton onClick={a2d} />
            </ButtonsContainer>
        );
    };

    return (
        <>
            <ChartContainer ref={chartRef}>
                <TitleContainer>
                    <FlexColumn>
                        <StyledHeaderTitle>
                            <BoxTitle tooltip={i18nFilter()("webdemographics.bar.title.tooltip")}>
                                {i18nFilter()(
                                    "dashboard.metricGallery.Website.WebDemographicsAge.title",
                                )}
                            </BoxTitle>
                        </StyledHeaderTitle>
                    </FlexColumn>
                    {!isEmpty && getUtilityButtons()}
                </TitleContainer>
                {isLoading ? (
                    <LoaderContainer>
                        <Loader />
                    </LoaderContainer>
                ) : (
                    <>
                        {isEmpty ? (
                            <TableNoData
                                icon="no-data"
                                messageTitle={i18nFilter()("global.nodata.notavilable")}
                            />
                        ) : (
                            <ChartAndLegendsWrapper>
                                <ChartWrapper>
                                    <Chart
                                        type={"column"}
                                        config={getBarChartConfig({
                                            filter: [percentageSignFilter, 1],
                                            tooltipFormatter: multipleDomainsTooltipFormatter,
                                        })}
                                        data={graphData}
                                    />
                                </ChartWrapper>

                                <StyledLegendsWrapper>
                                    <DemographicsChannelsLegends
                                        data={fullGraphData}
                                        keys={keys}
                                        onLegendToggle={lagendToggleHandler}
                                    />
                                </StyledLegendsWrapper>
                            </ChartAndLegendsWrapper>
                        )}
                    </>
                )}
            </ChartContainer>
        </>
    );
};
