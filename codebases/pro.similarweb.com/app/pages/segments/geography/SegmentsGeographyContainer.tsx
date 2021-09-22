import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import { connect } from "react-redux";
import SegmentsAnalysisAdvancedEmptyWrapper from "pages/segments/analysis/SegmentsAnalysisAdvancedEmpty";
import { SegmentsGeoContainer } from "pages/segments/geography/SegmentsGeoContainer";
import { ICustomSegmentAccount, ICustomSegmentsGroup } from "services/segments/segmentsApiService";

export interface ISegmentsGeographyContainer {
    params: any;
    organizationSegments: ICustomSegmentAccount[];
    groups: ICustomSegmentsGroup[];
}

export interface ISegmentsGeographyData {
    [countryCode: string]: ISegmentsGeoEngagementVerticals;
}

export interface ISegmentsGeoData {
    [Granularity: string]: {
        Average: number;
        Confidence: number;
    };
}

export interface ISegmentsGeoEngagementVerticals {
    TrafficShare: ISegmentsGeoData;
    Duration: ISegmentsGeoData;
    PagePerVisit: ISegmentsGeoData;
    BounceRate: ISegmentsGeoData;
    PageViews: ISegmentsGeoData;
}

const SegmentsGeographyContainer = (props: ISegmentsGeographyContainer) => {
    const { params } = props;
    return (
        <SegmentsAnalysisAdvancedEmptyWrapper>
            <SegmentsGeoContainer {...props} />
        </SegmentsAnalysisAdvancedEmptyWrapper>
    );
};

function mapStateToProps(store) {
    const {
        segmentsModule: { customSegmentsMeta, segmentsLoading },
    } = store;
    const { params } = store.routing;
    return {
        segments: customSegmentsMeta?.Segments,
        organizationSegments: customSegmentsMeta?.AccountSegments,
        groups: customSegmentsMeta?.SegmentGroups,
        customSegmentsMeta: customSegmentsMeta,
        params,
        isLoading: segmentsLoading,
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, undefined)(SegmentsGeographyContainer),
    "SegmentsGeographyContainer",
);
