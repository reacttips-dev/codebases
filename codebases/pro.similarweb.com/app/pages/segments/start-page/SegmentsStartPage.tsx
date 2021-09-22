import { i18nFilter } from "filters/ngFilters";
import ComparisonTableEmptyState from "pages/segments/start-page/ComparisonTableEmptyState";
import { SegmentTableTabs } from "pages/segments/start-page/SegmentTableTabs";
import {
    SegmentsComparisonContainer,
    SegmentsContainer,
    PageTitle,
    SegmentsStartPageContainer,
} from "pages/segments/start-page/StyledComponents";
import React from "react";
import { connect } from "react-redux";
import {
    ICustomSegment,
    ICustomSegmentAccount,
    ICustomSegmentsGroup,
} from "services/segments/segmentsApiService";
import SegmentsComparisonTableContainer from "./SegmentsComparisonTableContainer";

export interface ISegmentsStartPageProps {
    segments: ICustomSegment[];
    organizationSegments: ICustomSegmentAccount[];
    groups: ICustomSegmentsGroup[];
    params: any;
    isLoading: boolean;
    isMidTierUser: boolean;
}

const SegmentsStartPage = (props: ISegmentsStartPageProps) => {
    const { groups, isMidTierUser } = props;
    const hasGroups = groups?.length > 0;
    return (
        <SegmentsStartPageContainer>
            <PageTitle>{i18nFilter()("segment.analysis.startpage.title")}</PageTitle>
            {isMidTierUser || !hasGroups ? (
                <ComparisonTableEmptyState isMidTierUser={isMidTierUser} hasGroups={hasGroups} />
            ) : (
                <SegmentsComparisonContainer>
                    <SegmentsComparisonTableContainer {...props} />
                </SegmentsComparisonContainer>
            )}
            <SegmentsContainer>
                <SegmentTableTabs {...props} />
            </SegmentsContainer>
        </SegmentsStartPageContainer>
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
        params,
        isLoading: segmentsLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SegmentsStartPage);
