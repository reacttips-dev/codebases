import { i18nFilter, percentageSignOnlyFilter } from "filters/ngFilters";
import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import {
    formatGenderPieChartData,
    getGenderPieChartConfig,
    getGenderPieChartStyle,
} from "./genderPiechartConfig";
import {
    TitleContainer,
    StyledHeaderTitle,
    GenderChartContainer,
    StyledChart,
    LoaderContainer,
} from "./StyledComponents";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { ButtonsContainer } from "components/Rule/src/styledComponents";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { PdfExportService } from "services/PdfExportService";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";
import _ from "lodash";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { Loader } from "pages/website-analysis/traffic-sources/paid-search/components/common/Loader";

interface IGenderDistributionPieChartProps {
    malePercent: number;
    femalePercent: number;
    isLoading?: boolean;
}

export const GenderDistributionPieChart: FunctionComponent<IGenderDistributionPieChartProps> = (
    props,
) => {
    const { malePercent, femalePercent, isLoading = false } = props;

    const isEmpty = isNaN(malePercent) && isNaN(femalePercent);

    const { chartConfig, chartStyle } = useMemo(() => {
        return {
            chartConfig: getGenderPieChartConfig({ type: "pie", filter: percentageSignOnlyFilter }),
            chartStyle: getGenderPieChartStyle(),
        };
    }, []);

    const services = React.useMemo(
        () => ({
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
        }),
        [],
    );

    const params = services.swNavigator.getParams() as any;
    const apiParams = services.swNavigator.getApiParams(params);
    const [chartRef, setChartRef] = useState(null);

    const getPNG = React.useCallback(() => {
        TrackWithGuidService.trackWithGuid("Gender_Distribution.png", "submit-ok", {
            type: "PNG",
        });
        const offSetX = 0;
        const offSetY = 50;
        const fileName = `Website Analysis Gender-Distribution-(${apiParams.key})-(from: ${apiParams.from})-(to: ${apiParams.to})`;
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

    const chartData = useMemo(() => {
        return formatGenderPieChartData(malePercent, femalePercent);
    }, [malePercent, femalePercent]);

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
            metric: "WebDemographicsGender",
            type: "PieChart",
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
        <GenderChartContainer ref={chartRef}>
            <TitleContainer>
                <FlexColumn>
                    <StyledHeaderTitle>
                        <BoxTitle tooltip={i18nFilter()("webdemographics.piechart.title.tooltip")}>
                            {i18nFilter()(
                                "dashboard.metricGallery.Website.DesktopDemographicsGender.title",
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
                        <StyledChart
                            type={"pie"}
                            config={chartConfig}
                            data={chartData}
                            domProps={chartStyle}
                            afterRender={(chart) => {
                                setChartRef(chart);
                                return {};
                            }}
                        />
                    )}
                </>
            )}
        </GenderChartContainer>
    );
};
