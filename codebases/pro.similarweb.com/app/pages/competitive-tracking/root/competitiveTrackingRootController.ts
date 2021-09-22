import {
    hasSegmentsClaim,
    loadCustomSegmentsMetadata,
} from "pages/segments/config/segmentsConfigHelpers";

export const competitiveTrackingRootController = () => {
    hasSegmentsClaim() && loadCustomSegmentsMetadata();
};
