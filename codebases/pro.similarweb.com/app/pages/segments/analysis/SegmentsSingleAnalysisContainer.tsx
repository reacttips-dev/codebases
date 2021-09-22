import SWReactRootComponent from "decorators/SWReactRootComponent";
import { BoxContainer } from "pages/conversion/components/ConversionScatterChart/StyledComponents";
import CustomSegmentsAnalysis from "pages/segments/analysis/CustomSegmentsAnalysis";
import { SegmentsAnalysisContainer } from "pages/segments/StyledComponents";
import * as React from "react";
import { connect } from "react-redux";
import { ICustomSegment, ICustomSegmentAccount } from "services/segments/segmentsApiService";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

export interface ISegmentsSingleAnalysisContainerProps {
    segments?: ICustomSegment[];
    organizationSegments?: ICustomSegmentAccount[];
    params?: any;
    isLoading?: boolean;
}

const SegmentsSingleAnalysisContainer = (props: ISegmentsSingleAnalysisContainerProps) => {
    const { organizationSegments, params } = props;

    const currentSegment = React.useMemo(
        () =>
            SegmentsUtils.getSegmentById(
                { segments: organizationSegments },
                params?.id,
            ) as ICustomSegmentAccount,
        [organizationSegments, params?.id],
    );

    if (currentSegment && currentSegment.isLocked) {
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        swNavigator.go("segments-homepage");
        return null;
    }
    return (
        <SegmentsAnalysisContainer>
            <BoxContainer data-automation-sites-vs-category={true}>
                <CustomSegmentsAnalysis currentSegment={currentSegment} />
            </BoxContainer>
        </SegmentsAnalysisContainer>
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
        params,
        isLoading: segmentsLoading,
    };
}

SWReactRootComponent(
    connect(mapStateToProps, undefined)(SegmentsSingleAnalysisContainer),
    "SegmentsSingleAnalysisContainer",
);

export default SegmentsSingleAnalysisContainer;
