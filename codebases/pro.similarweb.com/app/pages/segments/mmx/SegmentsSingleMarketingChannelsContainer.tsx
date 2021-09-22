import * as React from "react";
import { useMemo } from "react";
import { useLoading } from "custom-hooks/loadingHook";
import SegmentsApiService, { IBaseSingleRequestParams } from "services/segments/segmentsApiService";
import { SegmentsMmxSingleOverview } from "./SegmentsMmxSingleOverview";
import { SegmentsSingleMarketingChannelsGraphChart } from "pages/segments/mmx/SegmentsSingleMarketingGraphChart";
import { SegmentsAnalysisContainer } from "pages/segments/StyledComponents";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { connect } from "react-redux";
import DurationService from "services/DurationService";

export interface ISegmentsSingleMarketingChannelsContainer {
    params: any;
    organizationSegments: any;
}

const SegmentsSingleMarketingChannelsContainer: React.FC<ISegmentsSingleMarketingChannelsContainer> = (
    props,
) => {
    const { params, organizationSegments } = props;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const durationApi = DurationService.getDurationData(params.duration);
    const apiParams = swNavigator.getApiParams(params);
    let barChartData = undefined;
    const segmentData = organizationSegments.find((seg) => seg.id === params.id);

    const { segmentsApiService } = React.useMemo(
        () => ({
            segmentsApiService: new SegmentsApiService(),
        }),
        [],
    );
    // const [segmentMmxBarChartData, segmentMmxDataOps] = useLoading();
    const [segmentMmxGraphChartData, segmentMmxGraphDataOps] = useLoading();

    // This is the BarChart Data call, but because of performance issues we transform the Data retuning from Graph call to fit bar chart
    // const isMmxBarChartLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(
    //     segmentMmxBarChartData.state,
    // );

    const isGraphChartDataLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(
        segmentMmxGraphChartData.state,
    );

    React.useEffect(() => {
        segmentMmxGraphDataOps.load(() =>
            segmentsApiService.getCustomSegmentMarketingMixGraphData({
                ...apiParams,
                id: undefined,
                segmentsIds: params.id,
                keys: "null",
                webSource: "Desktop",
                includeSubDomains: true,
                lastUpdated: segmentData.lastUpdated,
            } as IBaseSingleRequestParams),
        );
    }, [params]);

    useMemo(() => {
        barChartData = transformGraphMMXDataToBarChartData(
            segmentMmxGraphChartData.data,
            params.id,
        );
    }, [isGraphChartDataLoading]);
    return (
        <SegmentsAnalysisContainer>
            <SegmentsMmxSingleOverview
                params={params}
                data={barChartData}
                isLoading={isGraphChartDataLoading}
            />
            <SegmentsSingleMarketingChannelsGraphChart
                params={params}
                data={segmentMmxGraphChartData.data}
                isLoading={isGraphChartDataLoading}
                organizationSegments={organizationSegments}
            />
        </SegmentsAnalysisContainer>
    );
};

function mapStateToProps(store) {
    const {
        segmentsModule: { customSegmentsMeta },
    } = store;
    return {
        organizationSegments: customSegmentsMeta?.AccountSegments,
    };
}

export default connect(mapStateToProps, undefined)(SegmentsSingleMarketingChannelsContainer);

export interface ISegmentsMMXDataPoint {
    Value: number;
    Percentage: number;
    Confidence: number;
}

export interface ISegmentsMMXBarChartEngagementVerticals {
    Visits: ISegmentsMMXBarChannelData;
    Duration: ISegmentsMMXBarChannelData;
    PagesPerVisit: ISegmentsMMXBarChannelData;
    BounceRate: ISegmentsMMXBarChannelData;
    PageViews: ISegmentsMMXBarChannelData;
}

export interface ISegmentsMMXGraphChartEngagementVerticals {
    Visits: ISegmentsMMXGraphChannelsData;
    Duration: ISegmentsMMXGraphChannelsData;
    PagesPerVisit: ISegmentsMMXGraphChannelsData;
    BounceRate: ISegmentsMMXGraphChannelsData;
    PageViews: ISegmentsMMXGraphChannelsData;
}

export interface ISegmentsMMXBarChannelData {
    "Internal Referrals": ISegmentsMMXDataPoint;
    "Paid Search": ISegmentsMMXDataPoint;
    "Organic Search": ISegmentsMMXDataPoint;
    Direct: ISegmentsMMXDataPoint;
    Social: ISegmentsMMXDataPoint;
    Referrals: ISegmentsMMXDataPoint;
    Email: ISegmentsMMXDataPoint;
    "Display Ads": ISegmentsMMXDataPoint;
}

export interface ISegmentsMMXGraphChannelsData {
    "Internal Referrals": ISegmentsMMXGraphSingleChannelData;
    "Paid Search": ISegmentsMMXGraphSingleChannelData;
    "Organic Search": ISegmentsMMXGraphSingleChannelData;
    Direct: ISegmentsMMXGraphSingleChannelData;
    Social: ISegmentsMMXGraphSingleChannelData;
    Referrals: ISegmentsMMXGraphSingleChannelData;
    Email: ISegmentsMMXGraphSingleChannelData;
    "Display Ads": ISegmentsMMXGraphSingleChannelData;
}

export interface ISegmentsMMXGraphSingleChannelData {
    Breakdown: { Key: string; Value: ISegmentsMMXDataPoint }[];
    Total: ISegmentsMMXDataPoint;
}

export interface ISegmentsMMXGraphData {
    [segmentId: string]: {
        Monthly: ISegmentsMMXGraphChartEngagementVerticals;
        Weekly: ISegmentsMMXGraphChartEngagementVerticals;
        Meta?: {
            SegmentShare?: number;
        };
    };
}

export interface ISegmentsMMXBarChartData {
    Data: {
        [segmentId: string]: ISegmentsMMXBarChartEngagementVerticals;
    };
}

export const transformGraphMMXDataToBarChartData = (
    graphData: ISegmentsMMXGraphData,
    segmentId: string,
): ISegmentsMMXBarChartData => {
    return !graphData
        ? undefined
        : {
              Data: {
                  [segmentId]: {
                      Visits: {
                          "Internal Referrals":
                              graphData?.[segmentId]?.Monthly?.Visits?.["Internal Referrals"]
                                  ?.Total,
                          "Paid Search":
                              graphData?.[segmentId]?.Monthly?.Visits?.["Paid Search"]?.Total,
                          "Organic Search":
                              graphData?.[segmentId]?.Monthly?.Visits?.["Organic Search"]?.Total,
                          Direct: graphData?.[segmentId]?.Monthly?.Visits?.Direct?.Total,
                          Social: graphData?.[segmentId]?.Monthly?.Visits?.Social?.Total,
                          Referrals: graphData?.[segmentId]?.Monthly?.Visits?.Referrals?.Total,
                          Email: graphData?.[segmentId]?.Monthly?.Visits?.Email?.Total,
                          "Display Ads":
                              graphData?.[segmentId]?.Monthly?.Visits?.["Display Ads"]?.Total,
                      },
                      Duration: undefined,
                      PagesPerVisit: undefined,
                      BounceRate: undefined,
                      PageViews: undefined,
                  },
              },
          };
};
