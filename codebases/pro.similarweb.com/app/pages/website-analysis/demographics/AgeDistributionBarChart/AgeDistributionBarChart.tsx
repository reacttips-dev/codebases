import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { getAgeBarChartConfig } from "./ageBarChartConfig";
import {
    TitleContainer,
    StyledHeaderTitle,
    AgeChartContainer,
    StyledChart,
    LoaderContainer,
} from "./StyledComponents";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { ButtonsContainer } from "components/Rule/src/styledComponents";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { PdfExportService } from "services/PdfExportService";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { SwNavigator } from "common/services/swNavigator";
import _ from "lodash";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { Loader } from "pages/website-analysis/traffic-sources/paid-search/components/common/Loader";

interface IAgeProps {
    Age18To24: number;
    Age25To34: number;
    Age35To44: number;
    Age45To54: number;
    Age55To64: number;
    Age65Plus: number;
}
interface IAgeDistributionBarChartProps {
    ageProps: IAgeProps;
    isLoading?: boolean;
}

export const AgeDistributionBarChart: FunctionComponent<IAgeDistributionBarChartProps> = (
    props,
) => {
    const { isLoading = false, ageProps } = props;

    const chartRef = useRef<HTMLElement>(); // for the png

    const services = React.useMemo(
        () => ({
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
        }),
        [],
    );
    const params = services.swNavigator.getParams() as any;
    const apiParams = services.swNavigator.getApiParams(params);

    const chartConfig = useMemo(() => {
        return getAgeBarChartConfig({ type: "column" });
    }, []);

    // check if the data is empty:
    const isEmpty = useMemo(() => {
        if (!ageProps) return true;

        let isEmptyFlag = true;
        Object.values(ageProps).map((val) => {
            if (val) {
                isEmptyFlag = false;
            }
        });
        return isEmptyFlag;
    }, [ageProps]);

    const getPNG = useCallback(() => {
        TrackWithGuidService.trackWithGuid("Age_Distribution.png", "submit-ok", {
            type: "PNG",
        });
        const offSetX = 0;
        const offSetY = 50;
        const fileName = `Website Analysis Age-distribution-(${apiParams.key})-(from: ${apiParams.from})-(to: ${apiParams.to})`;
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
        if (!ageProps) return;

        const augmentedProps = Object.values(ageProps).map((val) => {
            return { y: val, color: "#4f8df9" };
        });

        return [{ data: augmentedProps }];
    }, [ageProps]);

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
        <AgeChartContainer ref={chartRef}>
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
                        <StyledChart type={"column"} data={chartData} config={chartConfig} />
                    )}
                </>
            )}
        </AgeChartContainer>
    );
};
