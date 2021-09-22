import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";
import GeographyApiService, {
    IWebAnalysisGeoExcelRequestParams,
} from "pages/website-analysis/geography/WebAnalysisGeographyApiService";
import { useLoading } from "custom-hooks/loadingHook";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { i18nFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import {
    BoxContainer,
    StyledHeaderTitle,
    TitleContainer,
    WebsiteAnalysisGeoContainer,
    ButtonsContainer,
} from "pages/website-analysis/geography/StyledComponents";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import { GeographyTable } from "pages/website-analysis/geography/GeographyTable";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export interface IWebAnalysisGeographyContainer {
    params: any;
}
export interface IWebAnalysisGeographyData {
    Data: IDomainGeographyData[];
}
export interface IDomainGeographyData {
    AvgVisitDuration: number;
    BounceRate: number;
    Change: number;
    Country: number;
    PagePerVisit: number;
    Rank: number;
    Share: number;
    ShareList: {
        [domain: string]: number;
    };
}

const WebAnalysisGeographyContainer = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const params = swNavigator.getParams() as any;
    const i18n = i18nFilter();
    const apiParams = swNavigator.getApiParams(params);
    const { geographyApiService } = React.useMemo(
        () => ({
            geographyApiService: new GeographyApiService(),
        }),
        [],
    );
    const [webAnalysisGeoTableData, webAnalysisGeoTableDataOps] = useLoading();
    const isGeoLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(
        webAnalysisGeoTableData.state,
    );
    const renderNoData = () => {
        return (
            <TableNoData icon="no-data" messageTitle={i18nFilter()("global.nodata.notavilable")} />
        );
    };
    React.useEffect(() => {
        webAnalysisGeoTableDataOps.load(() => {
            const {
                from,
                to,
                timeGranularity = "Monthly",
                webSource = "Desktop",
                includeSubDomains = params.isWWW === "*",
                isWindow,
                orderBy,
                country,
                key,
            } = apiParams;
            return geographyApiService.getDomainsGeographyTableData({
                from,
                to,
                timeGranularity,
                webSource,
                includeSubDomains,
                isWindow,
                orderBy,
                country,
                key,
            } as any);
        });
    }, []);

    const durationObject = React.useMemo(() => DurationService.getDurationData(params.duration), [
        params.duration,
    ]);

    const tableExcelLink = useMemo(() => {
        const {
            from,
            to,
            timeGranularity = "Monthly",
            webSource = "Desktop",
            includeSubDomains = params.isWWW === "*",
            isWindow,
            orderBy,
            country,
            key,
        } = apiParams;
        return geographyApiService.getDomainsGeographyTableExcelUrl({
            from,
            to,
            timeGranularity,
            webSource,
            includeSubDomains,
            orderBy,
            country,
            keys: key,
            fileName: `Website Analysis Geography-(${key})-(from: ${from})-(to: ${to})`,
            isWindow,
        } as IWebAnalysisGeoExcelRequestParams);
    }, [params]);

    const isCompare = React.useMemo(() => {
        return params?.key?.split(",").length > 1;
    }, [params.key]);
    const subtitleFilters = React.useMemo(
        () => [
            {
                filter: "date",
                value: {
                    from: durationObject.raw.from.valueOf(),
                    to: durationObject.raw.to.valueOf(),
                    useRangeDisplay:
                        params.duration !== "28d" ||
                        durationObject.raw.from.format("YYYY-MM") !==
                            durationObject.raw.to.format("YYYY-MM"),
                },
            },
            {
                filter: "webSource",
                value: "Desktop",
            },
        ],
        [params.country, durationObject],
    );

    useEffect(() => {
        return cleanDashboardModal;
    }, []);
    const A2DRef = useRef() as any;
    const cleanDashboardModal = () => {
        A2DRef?.current?.dismiss();
    };
    const a2d = () => {
        A2DRef.current = addToDashboard({
            modelType: "fromWebsite",
            metric: "Geography",
            type: "GeographyTable",
            overrideAddToDashboardParams: { country: "999" },
        });
    };

    const onExcelClick = () => {
        TrackWithGuidService.trackWithGuid(
            "website.analysis.geography.excel.download",
            "submit-ok",
            { type: "Excel" },
        );
    };
    const getUtilityButtons = () => {
        return (
            <ButtonsContainer>
                {tableExcelLink && (
                    <a href={tableExcelLink}>
                        <DownloadButtonMenu
                            Excel={true}
                            downloadUrl={tableExcelLink}
                            exportFunction={onExcelClick}
                        />
                    </a>
                )}
                <div>
                    <AddToDashboardButton onClick={a2d} />
                </div>
                {/*<DownloadButtonMenu PNG={true} exportFunction={getPNG} />*/}
            </ButtonsContainer>
        );
    };

    return (
        <WebsiteAnalysisGeoContainer>
            <BoxContainer data-automation-website-analysis-geo={true}>
                <TitleContainer>
                    <FlexColumn>
                        <StyledHeaderTitle>
                            <BoxTitle tooltip={i18nFilter()("segment.analysis.geo.title.tooltip")}>
                                {i18nFilter()("segment.analysis.geo.title")}
                            </BoxTitle>
                        </StyledHeaderTitle>
                        <StyledBoxSubtitle>
                            <BoxSubtitle filters={subtitleFilters} />
                        </StyledBoxSubtitle>
                    </FlexColumn>
                    {getUtilityButtons()}
                </TitleContainer>
                {!isGeoLoading && !webAnalysisGeoTableData && renderNoData()}
                <GeographyTable
                    isCompare={isCompare}
                    tableData={webAnalysisGeoTableData.data}
                    isLoading={isGeoLoading}
                />
            </BoxContainer>
        </WebsiteAnalysisGeoContainer>
    );
};

export default SWReactRootComponent(WebAnalysisGeographyContainer, "WebAnalysisGeographyContainer");
