import SWReactRootComponent from "decorators/SWReactRootComponent";
import SegmentsGroupAnalysisOverviewContainer from "pages/segments/analysis/SegmentsGroupAnalysisOverviewContainer";
import SegmentsSingleAnalysisContainer from "pages/segments/analysis/SegmentsSingleAnalysisContainer";
import * as React from "react";
import { connect } from "react-redux";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import SegmentsAnalysisAdvancedEmptyWrapper from "pages/segments/analysis/SegmentsAnalysisAdvancedEmpty";

interface ISegmentsAnalysisTrafficContainer {
    params: any;
}

export const MODE = {
    single: "single",
    group: "group",
};

const SegmentsAnalysisTrafficContainer = (props: ISegmentsAnalysisTrafficContainer) => {
    const { params } = props;
    let ComponentToRender = null;
    switch (params?.mode) {
        case MODE.single:
            ComponentToRender = SegmentsSingleAnalysisContainer;
            break;
        case MODE.group:
            const isMidTierUser = SegmentsUtils.isMidTierUser();
            if (isMidTierUser) {
                const swNavigator = Injector.get<SwNavigator>("swNavigator");
                swNavigator.go("segments-homepage");
            } else {
                ComponentToRender = SegmentsGroupAnalysisOverviewContainer;
            }
            break;
    }
    return ComponentToRender ? (
        <SegmentsAnalysisAdvancedEmptyWrapper>
            <ComponentToRender {...props} />
        </SegmentsAnalysisAdvancedEmptyWrapper>
    ) : null;
};

function mapStateToProps(store) {
    const {
        segmentsModule: { customSegmentsMeta, segmentsLoading },
    } = store;
    const { params } = store.routing;
    return {
        segments: customSegmentsMeta?.Segments,
        organizationSegments: customSegmentsMeta?.AccountSegments,
        customSegmentsMeta: customSegmentsMeta,
        params,
        isLoading: segmentsLoading,
    };
}

SWReactRootComponent(
    connect(mapStateToProps, undefined)(SegmentsAnalysisTrafficContainer),
    "SegmentsAnalysisTrafficContainer",
);
