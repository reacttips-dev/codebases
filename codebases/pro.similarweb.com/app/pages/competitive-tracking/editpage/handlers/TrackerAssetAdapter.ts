import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";
import { ETrackerAssetType, ITrackerCompetitorAssets } from "services/competitiveTracker/types";
import { ICustomSegmentsMetaData } from "services/segments/segmentsApiService";
import { ICompetitiveTrackingEditMetaData } from "pages/competitive-tracking/editpage/CompetitiveTrackingEditPageTypes";
import { IWebsitesFavicons } from "services/sitesResource/types";

const adaptWebsiteAsset = (
    assetId: string,
    websitesFavicons: IWebsitesFavicons = {},
): ITrackerAsset => {
    return {
        id: assetId,
        type: ETrackerAssetType.Website,
        displayText: assetId,
        image: websitesFavicons[assetId],
    };
};

const adaptSegmentAsset = (
    assetId: string,
    segmetnsData: ICustomSegmentsMetaData,
): ITrackerAsset => {
    const allSegments = [...segmetnsData.AccountSegments, ...segmetnsData.Segments];
    const segment = allSegments.find((segment) => segment.id === assetId);
    return {
        id: assetId,
        type: ETrackerAssetType.Segment,
        displayText: segment?.domain,
        name: segment?.segmentName,
        image: segment?.favicon,
    };
};

const adaptCompanyAsset = (assetId: string): ITrackerAsset => {
    return null;
};

export const adaptTrackerAssetsForEdit = (
    competitorAssets: ITrackerCompetitorAssets,
    metaData: ICompetitiveTrackingEditMetaData,
) => {
    return Object.entries(competitorAssets).reduce<ITrackerAsset[]>((res, [type, assetIds]) => {
        const adaptedAssets = assetIds.map((assetId) =>
            adaptTrackerAssetForEdit(Number(type), assetId, metaData),
        );
        return [...res, ...adaptedAssets];
    }, []);
};

export const adaptTrackerAssetForEdit = (
    assetType: ETrackerAssetType,
    assetId: string,
    metaData: ICompetitiveTrackingEditMetaData,
): ITrackerAsset => {
    const { segments, websitesFavicons } = metaData;
    switch (assetType) {
        case ETrackerAssetType.Website:
            return adaptWebsiteAsset(assetId, websitesFavicons);

        case ETrackerAssetType.Segment:
            return adaptSegmentAsset(assetId, segments);

        case ETrackerAssetType.Company:
            return adaptCompanyAsset(assetId);
    }
};
