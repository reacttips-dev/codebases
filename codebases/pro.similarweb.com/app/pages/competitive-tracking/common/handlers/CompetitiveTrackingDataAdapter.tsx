import { ICategory } from "common/services/categoryService.types";
import { ICountry } from "components/filters-bar/country-filter/CountryFilterTypes";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";
import {
    ETrackerAssetType,
    ETrackerType,
    ITrackerBase,
    ITrackerCompetitorAssets,
} from "services/competitiveTracker/types";

export const buildTrackerBase = (
    name: string,
    selectedIndustry: ICategory,
    country: ICountry,
    selectedAsset: ITrackerAsset,
    selectedCompetitors: ITrackerAsset[],
): ITrackerBase => {
    return {
        name,
        type: ETrackerType.Research,
        industryId: selectedIndustry?.forApi,
        country: country.id,
        mainPropertyId: selectedAsset.id,
        mainPropertyType: selectedAsset.type,
        competitors: buildCompetitorAssets(selectedCompetitors),
    };
};

const buildCompetitorAssets = (selectedCompetitors: ITrackerAsset[]): ITrackerCompetitorAssets => {
    const { Company, Website, Segment } = ETrackerAssetType;
    const companies = selectedCompetitors.filter(trackerAssetTypeFilter(Company));
    const websites = selectedCompetitors.filter(trackerAssetTypeFilter(Website));
    const segments = selectedCompetitors.filter(trackerAssetTypeFilter(Segment));
    const competitors = {
        //[Company]: companies.map(onlyId),
        [Website]: websites.map(onlyId),
        [Segment]: segments.map(onlyId),
    };
    return competitors;
};

const trackerAssetTypeFilter = (trackerAssetType) => ({ type }) => type === trackerAssetType;
const onlyId = (item) => item.id;
