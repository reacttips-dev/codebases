import { ETrackerAssetType } from "services/competitiveTracker/types";
import { i18nFilter } from "filters/ngFilters";

const translate = i18nFilter();

export const trackerAssetTypes = {
    [ETrackerAssetType.Website]: {
        displayName: {
            singular: translate("common.website"),
            plural: translate("common.websites"),
        },
    },
    [ETrackerAssetType.Segment]: {
        displayName: {
            singular: translate("common.segment"),
            plural: translate("common.segments"),
        },
    },
    [ETrackerAssetType.Company]: {
        displayName: {
            singular: translate("common.company"),
            plural: translate("common.companies"),
        },
    },
};
