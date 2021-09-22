import categoryService from "common/services/categoryService";
import { ITracker } from "services/competitiveTracker/types";
import { ICompetitiveTrackingEditMetaData } from "../CompetitiveTrackingEditPageTypes";
import { adaptTrackerAssetForEdit, adaptTrackerAssetsForEdit } from "./TrackerAssetAdapter";
import { ICategory } from "common/services/categoryService.types";
import { ICountry } from "components/filters-bar/country-filter/CountryFilterTypes";
import { buildTrackerBase } from "pages/competitive-tracking/common/handlers/CompetitiveTrackingDataAdapter";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";

export const buildUpdatedTrackerFromEdit = (
    existingTracker: ITracker,
    name: string,
    industry: ICategory,
    country: ICountry,
    mainProperty: ITrackerAsset,
    competitors: ITrackerAsset[],
): ITracker => {
    const updatedTracker = buildTrackerBase(name, industry, country, mainProperty, competitors);

    return {
        id: existingTracker.id,
        lastUpdated: existingTracker.lastUpdated,
        ...updatedTracker,
    };
};

export const adaptTrackerDataForEditPage = (
    tracker: ITracker,
    metaData: ICompetitiveTrackingEditMetaData,
) => {
    const trackerCompetitors = adaptTrackerAssetsForEdit(tracker.competitors, metaData);

    const trackerProperty = adaptTrackerAssetForEdit(
        tracker.mainPropertyType,
        tracker.mainPropertyId,
        metaData,
    );
    const trackerCountry = metaData.countries.find((country) => country.id === tracker.country);
    const trackerIndustry = tracker.industryId
        ? categoryService.getCategory(tracker.industryId, "forApi")
        : null;

    return {
        name: tracker.name,
        mainProperty: trackerProperty,
        competitors: trackerCompetitors,
        country: trackerCountry,
        industry: trackerIndustry,
    };
};
