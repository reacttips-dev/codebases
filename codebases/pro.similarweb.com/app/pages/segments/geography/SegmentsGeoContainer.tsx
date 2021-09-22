import * as React from "react";
import { useMemo, useState } from "react";
import {
    ISegmentsGeographyContainer,
    ISegmentsGeographyData,
} from "pages/segments/geography/SegmentsGeographyContainer";
import SegmentsApiService, {
    ICustomSegment,
    ISegmentGeoExcelRequestParams,
    ISegmentGeoRequestParams,
} from "services/segments/segmentsApiService";
import { useLoading } from "custom-hooks/loadingHook";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { i18nFilter } from "filters/ngFilters";
import { StyledHeaderTitle } from "pages/website-analysis/audience-overlap/StyledComponents";
import { FlexColumn, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import DurationService from "services/DurationService";
import { SWReactIcons } from "@similarweb/icons";
import {
    GreyNotificationContainer,
    GroupContainer,
    PredDropDownLabel,
    SegmentsGeoAnalysisContainer,
    TitleContainer,
    FlexRowAlignCenter,
} from "pages/segments/geography/StyledComponents";
import { SegmentsChipDownContainer } from "@similarweb/ui-components/dist/dropdown/src/SegmentsChipDownContainer";
import { ListItemSegment } from "@similarweb/ui-components/dist/list-item/src/items/ListItemSegment";
import { SegmentsGeographyTable } from "./SegmentsGeographyTable";
import {
    BoxContainer,
    ExcelButtonContainer,
} from "pages/segments/components/benchmarkOvertime/StyledComponents";
import { ExcelButton } from "components/React/ExcelButton/ExcelButton";

export const GreyNotificationMessage = ({ messageKey = "" }) => (
    <GreyNotificationContainer>
        <SWReactIcons iconName="info" size="xs" />
        <span>{i18nFilter()(messageKey)}</span>
    </GreyNotificationContainer>
);

export const SegmentsGeoContainer = (props: ISegmentsGeographyContainer) => {
    const { params, organizationSegments, groups } = props;
    const { mode } = params;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const apiParams = swNavigator.getApiParams(params);
    const { segmentsApiService } = React.useMemo(
        () => ({
            segmentsApiService: new SegmentsApiService(),
        }),
        [],
    );
    const [selectedSegmentId, setSelectedSegmentId] = useState(() => {
        if (mode === "single") {
            return params.id;
        }
        const group = props.groups?.find((grp) => grp.id === params.id);
        return group.segments[0];
    });
    const [segmentGeoTableData, segmentGeoTableDataOps] = useLoading();
    const selectedSegmentData = useMemo(() => {
        return organizationSegments.find((seg) => seg.id === selectedSegmentId);
    }, [selectedSegmentId]);

    const segmentGroupData: ICustomSegment[] = useMemo(() => {
        if (mode === "group") {
            const group = props.groups?.find((grp) => grp.id === params.id);
            return group.segments.map((segId) =>
                organizationSegments.find((seg) => seg.id === segId),
            );
        } else {
            return [];
        }
    }, [mode]);

    const isGeoLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(
        segmentGeoTableData.state,
    );
    const renderNoData = () => {
        return (
            <TableNoData icon="no-data" messageTitle={i18nFilter()("global.nodata.notavilable")} />
        );
    };

    React.useEffect(() => {
        segmentGeoTableDataOps.load(() => {
            const {
                from,
                to,
                timeGranularity = "Monthly",
                webSource = "Desktop",
                includeSubDomains = true,
                isWindow,
            } = apiParams;
            return segmentsApiService.getSegmentGeographyData({
                from,
                to,
                timeGranularity,
                webSource,
                includeSubDomains,
                sid: selectedSegmentId,
                lastUpdated: selectedSegmentData.lastUpdated,
                isWindow,
            } as ISegmentGeoRequestParams);
        });
    }, [params, selectedSegmentId]);

    const durationObject = React.useMemo(() => DurationService.getDurationData(params.duration), [
        params.duration,
    ]);

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

    const transformedData = useMemo(() => {
        if (!isGeoLoading) {
            const tableData: ISegmentsGeographyData = segmentGeoTableData.data;
            return Object.keys(tableData)?.map((countryId) => {
                const tableRow = tableData[countryId];
                const transformedRowObject = {
                    Country: countryId,
                };
                const currentRowConfidence =
                    tableRow?.["PagePerVisit"]?.["Monthly"]?.["Confidence"];
                Object.keys(tableRow).map((currentMetric) => {
                    if (currentMetric === "TrafficShare") {
                        transformedRowObject[currentMetric] =
                            currentRowConfidence &&
                            currentRowConfidence > 0 &&
                            currentRowConfidence <= 1
                                ? tableRow?.[currentMetric]?.["Average"]
                                : null;
                    } else {
                        transformedRowObject[currentMetric] =
                            currentRowConfidence &&
                            currentRowConfidence > 0 &&
                            currentRowConfidence <= 1
                                ? tableRow?.[currentMetric]?.["Monthly"]?.["Average"]
                                : null;
                    }
                });
                return transformedRowObject;
            });
        }
        return undefined;
    }, [isGeoLoading, segmentGeoTableData.data]);

    const onClick = (selectedSegmentData) => {
        setSelectedSegmentId(selectedSegmentData.segmentId);
    };
    const onClose = (selectedSegmentData) => {
        if (selectedSegmentData?.segmentId) {
            setSelectedSegmentId(selectedSegmentData.segmentId);
        }
    };

    const tableExcelLink = useMemo(() => {
        const {
            from,
            to,
            timeGranularity = "Monthly",
            webSource = "Desktop",
            includeSubDomains = true,
            isWindow,
        } = apiParams;
        return segmentsApiService.getSegmentGeographyExcelUrl({
            from,
            to,
            timeGranularity,
            webSource,
            includeSubDomains,
            sid: selectedSegmentId,
            lastUpdated: selectedSegmentData?.lastUpdated,
            fileName: `SegmentsGeography-(${selectedSegmentData?.segmentName})-(from: ${from})-(to: ${to})`,
            isWindow,
        } as ISegmentGeoExcelRequestParams);
    }, [params, selectedSegmentId]);

    return (
        <SegmentsGeoAnalysisContainer>
            <BoxContainer data-automation-segment-analysis-geo={true}>
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
                    <RightFlexRow>
                        <ExcelButtonContainer>
                            <ExcelButton
                                url={tableExcelLink}
                                trackName={`segment geo for ${selectedSegmentId}`}
                            />
                        </ExcelButtonContainer>
                    </RightFlexRow>
                </TitleContainer>
                {!isGeoLoading && !segmentGeoTableData && renderNoData()}
                {mode === "group" && (
                    <GroupContainer data-automation-segments-geo-group={true}>
                        <GreyNotificationMessage messageKey={"segment.analysis.geo.disclaimer"} />
                        <FlexRowAlignCenter>
                            <PredDropDownLabel>
                                {i18nFilter()("segment.analysis.geo.group.pre.dropdown.label")}
                            </PredDropDownLabel>
                            <SegmentsChipDownContainer
                                selectedSegmentText={
                                    selectedSegmentData && selectedSegmentData.segmentName
                                }
                                selectedSegmentDomainIcon={
                                    selectedSegmentData && selectedSegmentData.favicon
                                }
                                selectedSegmentDomainText={
                                    selectedSegmentData && selectedSegmentData.domain
                                }
                                buttonText="Select segment..."
                                onClick={onClick}
                                onCloseItem={onClose}
                            >
                                {segmentGroupData.map((segmentData) => (
                                    <ListItemSegment
                                        key={segmentData.id}
                                        img={segmentData.favicon}
                                        segmentName={segmentData.segmentName}
                                        domainName={segmentData.domain}
                                        segmentId={segmentData.id}
                                    />
                                ))}
                            </SegmentsChipDownContainer>
                        </FlexRowAlignCenter>
                    </GroupContainer>
                )}
                <SegmentsGeographyTable tableData={transformedData} isLoading={isGeoLoading} />
            </BoxContainer>
        </SegmentsGeoAnalysisContainer>
    );
};
