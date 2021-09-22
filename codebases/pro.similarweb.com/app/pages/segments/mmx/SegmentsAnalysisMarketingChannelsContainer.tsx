import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import { connect } from "react-redux";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import SegmentsSingleMarketingChannelsContainer from "pages/segments/mmx/SegmentsSingleMarketingChannelsContainer";
import { ConnectSegmentsGroupMarketingChannelsContainer } from "pages/segments/mmx/SegmentsGroupMarketingChannelsContainer";
import SegmentsAnalysisAdvancedEmptyWrapper from "pages/segments/analysis/SegmentsAnalysisAdvancedEmpty";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { i18nFilter } from "filters/ngFilters";
import { BoxContainer, GroupMMXContainer } from "pages/segments/mmx/styledComponents";

interface ISegmentsAnalysisMarketingChannelsContainer {
    params: any;
}

export const MODE = {
    single: "single",
    group: "group",
};

const SegmentsAnalysisMarketingChannelsContainer = (
    props: ISegmentsAnalysisMarketingChannelsContainer,
) => {
    const { params } = props;
    let ComponentToRender = null;
    let isUnavailable = false;
    switch (params?.mode) {
        case "single":
            ComponentToRender = SegmentsSingleMarketingChannelsContainer;
            break;
        case "group":
            const isMidTierUser = SegmentsUtils.isMidTierUser();
            if (isMidTierUser) {
                const swNavigator = Injector.get<SwNavigator>("swNavigator");
                swNavigator.go("segments-homepage");
            } else {
                isUnavailable = false;
                ComponentToRender = ConnectSegmentsGroupMarketingChannelsContainer;
            }
            break;
    }
    return ComponentToRender ? (
        isUnavailable ? (
            <GroupMMXContainer>
                <BoxContainer>
                    <TableNoData
                        icon="no-data"
                        messageTitle={i18nFilter()("segmentsmmx.coming.soon.compare")}
                    />
                </BoxContainer>
            </GroupMMXContainer>
        ) : (
            <SegmentsAnalysisAdvancedEmptyWrapper>
                <ComponentToRender {...props} />
            </SegmentsAnalysisAdvancedEmptyWrapper>
        )
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

export const ConnectSegmentsAnalysisMarketingChannelsContainer = connect(
    mapStateToProps,
    undefined,
)(SegmentsAnalysisMarketingChannelsContainer);
SWReactRootComponent(
    ConnectSegmentsAnalysisMarketingChannelsContainer,
    "SegmentsAnalysisMarketingChannelsContainer",
);
