import categoryService from "common/services/categoryService";
import { ICategory } from "common/services/categoryService.types";
import { ISegmentsModule } from "services/competitiveTracker/types";

export const getSegmentForId = (segmentId: string, segmentsData: ISegmentsModule) => {
    const { customSegmentsMeta, segmentsLoading } = segmentsData;
    if (segmentsLoading || !customSegmentsMeta) return null;

    const { Segments: segments = [], AccountSegments: accountSegments = [] } = customSegmentsMeta;
    const allSegments = [...segments, ...accountSegments];
    return allSegments.find(({ id }) => id === segmentId);
};

export const getIndustryForId = (industryId: string): ICategory => {
    return categoryService.getCategory(industryId, "forApi");
};

export type IGetSegment = typeof getSegmentForId;
export type IGetIndustry = typeof getIndustryForId;
