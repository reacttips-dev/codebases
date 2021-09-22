import { Injector } from "common/ioc/Injector";
import { useLoading } from "custom-hooks/loadingHook";
import * as React from "react";
import { useMemo, useState } from "react";
import { connect } from "react-redux";
import SegmentsApiService, { IBaseSingleRequestParams } from "services/segments/segmentsApiService";
import { SegmentsGroupMMXGraph } from "./SegmentsGroupMMXGraph";
import SegmentsGroupMMXTable from "./SegmentsGroupMMXTable";
import { GroupMMXContainer } from "pages/segments/mmx/styledComponents";
import { SwNavigator } from "common/services/swNavigator";
import { EngagementVerticals } from "pages/segments/mmx/SegmentsSingleMarketingGraphChart";
import { ENABLE_FIREBOLT } from "services/segments/SegmentsUtils";
import { WarningBannerOmittedSegments } from "../../../../.pro-features/pages/segments/SegmentsGroupAnalysisOverview";
import DurationService from "services/DurationService";

const SegmentsGroupMarketingChannelsContainer = (props) => {
    const { params, selectedRows, segments, organizationSegments, groups } = props;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const apiParams = swNavigator.getApiParams(params);
    const groupData = groups.find((group) => group.id === params.id);
    const [missingFireboltSegment, setMissingFireboltSegment] = useState(0);
    const [selectedDisplayTypeIndex, setSelectedDisplayTypeIndex] = useState(0);
    const [isClosedWarningOmittedSegments, setIsClosedWarningOmittedSegments] = React.useState(
        false,
    );
    const [selectedTab, setSelectedTab] = React.useState(0);
    const selectedMetric = Object.keys(EngagementVerticals)[selectedTab];
    const { segmentsApiService } = useMemo(
        () => ({
            segmentsApiService: new SegmentsApiService(),
        }),
        [],
    );
    const [segmentMMXGroupGraphData, segmentMMXGroupGraphDataOps] = useLoading();

    React.useEffect(() => {
        delete apiParams.id;
        segmentMMXGroupGraphDataOps.load(() =>
            segmentsApiService.getCustomSegmentMarketingMixGroupGraphData({
                ...apiParams,
                segmentGroupId: params.id,
                timeGranularity: "Monthly",
                keys: "null",
                webSource: "Desktop",
                includeSubDomains: true,
            }),
        );
    }, [params]);

    const isMMXGraphLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(
        segmentMMXGroupGraphData.state,
    );

    const closeWarningOmittedSegments = React.useCallback(
        () => setIsClosedWarningOmittedSegments(true),
        [],
    );

    React.useEffect(() => {
        if (!isMMXGraphLoading) {
            const currentGroup = groups.find((group) => group.id === params.id);
            setMissingFireboltSegment(
                currentGroup?.members.length - Object.keys(segmentMMXGroupGraphData.data).length,
            );
        }
    }, [params, groups, isMMXGraphLoading]);

    const allSegments = useMemo(() => organizationSegments.concat(segments as any), [
        segments,
        organizationSegments,
    ]);

    const graphProps = {
        groups,
        data: segmentMMXGroupGraphData.data,
        params,
        onGraphDDClick: (obj) => console.log("downloading graph " + obj.id),
        onScatterDDClick: (obj) => console.log("downloading scatter " + obj.id),
        tableExcelLink: "",
        selectedRows: selectedRows,
        isLoading: isMMXGraphLoading,
        rowSelectionProp: "id",
        setSelectedDisplayTypeIndex,
        selectedDisplayTypeIndex,
        allSegments,
        selectedMetric,
        selectedTab,
        setSelectedTab,
        groupData,
    };

    const tableProps = {
        isLoading: isMMXGraphLoading,
        data: segmentMMXGroupGraphData.data,
        selectedRows: selectedRows,
        tableSelectionKey: "SegmentMMXGroupTable",
        tableSelectionProperty: "id",
        selectedDisplayTypeIndex,
        allSegments,
        params,
        groups,
        selectedMetric,
    };

    return (
        <>
            {ENABLE_FIREBOLT && missingFireboltSegment > 0 && !isClosedWarningOmittedSegments && (
                <WarningBannerOmittedSegments
                    count={missingFireboltSegment}
                    onClose={closeWarningOmittedSegments}
                />
            )}
            <GroupMMXContainer>
                <SegmentsGroupMMXGraph {...graphProps} />
                <SegmentsGroupMMXTable {...tableProps} />
            </GroupMMXContainer>
        </>
    );
};

function mapStateToProps({
    tableSelection: { SegmentMMXGroupTable },
    segmentsModule: { customSegmentsMeta },
}) {
    return {
        selectedRows: SegmentMMXGroupTable,
        customSegmentsData: customSegmentsMeta?.AccountSegments,
        segments: customSegmentsMeta?.Segments,
        groups: customSegmentsMeta?.SegmentGroups,
    };
}

export const ConnectSegmentsGroupMarketingChannelsContainer = connect(
    mapStateToProps,
    null,
)(SegmentsGroupMarketingChannelsContainer);
