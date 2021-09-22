import {
    SelectedAssetItem,
    SelectedAssetItemView,
} from "pages/competitive-tracking/wizard/wizardSteps/fourtStep/selectedAssets/SelectedAssetItem";
import React, { useMemo } from "react";
import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import { SelectedCountryItem } from "pages/competitive-tracking/wizard/wizardSteps/fourtStep/selectedAssets/SelectedCountryItem";
import CountryService from "services/CountryService";
import categoryService from "common/services/categoryService";
import { SelectedIndustryItem } from "pages/competitive-tracking/wizard/wizardSteps/fourtStep/selectedAssets/SelectedIndustryItem";
import { i18nFilter } from "filters/ngFilters";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { ETrackerAssetType, ISegmentsModule } from "services/competitiveTracker/types";
import { TrackerOverviewContainer, Vs } from "./CompetitiveTrackerHighLevelMetrics.styles";
import { useCompetitiveTrackerHighLevelMetricsContext } from "./context/context";

export const getSegmentName = (segmentsModule: ISegmentsModule) => (mainPropertyId: string) => {
    const segments = segmentsModule?.customSegmentsMeta?.Segments ?? [];
    const accountSegments = segmentsModule?.customSegmentsMeta?.AccountSegments ?? [];
    const allSegments = [...segments, ...accountSegments];
    return allSegments.find(({ id }) => id === mainPropertyId)?.segmentName;
};

export const TrackerOverview = () => {
    const { queryParams, segmentsModule, data } = useCompetitiveTrackerHighLevelMetricsContext();
    const { trackerId } = queryParams;

    const services = useMemo(() => {
        return {
            trackersService: CompetitiveTrackerService,
            translate: i18nFilter(),
            countryService: CountryService,
            categoryService: categoryService,
        };
    }, []);

    const trackerProps = useMemo(() => {
        const tracker = services.trackersService.getById(trackerId) || null;
        if (!tracker) return null;

        const { mainPropertyId, mainPropertyType, country, industryId, competitors } = tracker;

        const mainPropertyDisplayText =
            mainPropertyType === ETrackerAssetType.Website
                ? mainPropertyId
                : getSegmentName(segmentsModule)(mainPropertyId);

        const mainProperty = { type: mainPropertyType, displayText: mainPropertyDisplayText };
        const selectedCountry = services.countryService.getCountryById(country);
        const categories = services.categoryService.getFlattenedCategoriesList();
        const selectedCategory =
            industryId && categories.find(({ forApi }) => forApi === industryId);

        return {
            mainProperty,
            selectedCountry,
            selectedCategory,
            competitors,
        };
    }, [services, trackerId, segmentsModule]);

    if (!trackerProps) return null;

    return (
        <TrackerOverviewContainer>
            <SelectedAssetItem selectedAsset={trackerProps.mainProperty} />
            <Vs>vs</Vs>
            <SelectedAssetItemView
                iconName={"globe"}
                displayText={services.translate(
                    "competitive.tracker.metrics.subtitle.competitors",
                    {
                        amount: Object.values(trackerProps.competitors).reduce(
                            (amount, current) => amount + current.length,
                            0,
                        ),
                    },
                )}
            />
            <SelectedCountryItem selectedCountry={trackerProps.selectedCountry} />
            {trackerProps.selectedCategory && (
                <SelectedIndustryItem selectedIndustry={trackerProps.selectedCategory} />
            )}
            <SelectedAssetItemView iconName={"desktop"} displayText={devicesTypes.DESKTOP} />
            {data?.duration && (
                <SelectedAssetItemView
                    iconName={"daily-ranking"}
                    displayText={services.translate(
                        "competitive.tracker.metrics.subtitle.duration",
                        {
                            duration: data.duration,
                        },
                    )}
                />
            )}
        </TrackerOverviewContainer>
    );
};
