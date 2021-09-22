import { filtersConfig } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/constants";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import {
    createCpcFilter,
    createVolumeFilter,
    getRangeFilterQueryParamValue,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";
import { buildFilters } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageUtillities";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";

const VENN_DATA_ENDPOINT_DESKTOP = "widgetApi/SearchKeywords/NewSearchKeywords/Table";
const VENN_DATA_ENDPOINT_MOBILE = "widgetApi/MobileSearchKeywords/NewSearchKeywords/Table";
const DEFAULT_SEPARATOR = ",";
const ENRICH_FILTERS_DATA_ENDPOINT = "api/workspaces/marketing/keywords/trafficShareFilter";

export const getFilterData = async (filtersStateObject) => {
    const {
        country,
        duration,
        webSource,
        keys,
        includeSubDomains,
        page,
        family,
        source,
        IncludeBranded,
        IncludeNoneBranded,
        cpcFromValue,
        cpcToValue,
        volumeFromValue,
        volumeToValue,
        IncludeTerms,
        ExcludeTerms,
        IncludeUrls,
        ExcludeUrls,
        gapFilterSelectedTab,
        predefinedFiler,
        limitsUsingAndOperator,
        selectedIntersection,
        timeGranularity,
    } = filtersStateObject;
    const { to, from, isWindow } = DurationService.getDurationData(duration).forAPI;
    const queryParams = {
        country,
        duration,
        webSource,
        keys,
        includeSubDomains,
        page,
        pageSize: Number(),
        to,
        from,
        isWindow,
        CalculateVennData: true,
        IncludeBranded,
        IncludeNoneBranded,
        IncludeTerms,
        ExcludeTerms,
        IncludeUrls,
        ExcludeUrls,
    };
    const searchFilterQueryParamValue = buildFilters({
        source: source || null,
        family: family || null,
    });
    const rangeFilterQueryParamValue = getRangeFilterQueryParamValue([
        createVolumeFilter(volumeFromValue, volumeToValue),
        createCpcFilter(cpcFromValue, cpcToValue),
    ]);
    if (searchFilterQueryParamValue) queryParams["filter"] = searchFilterQueryParamValue;
    if (rangeFilterQueryParamValue) queryParams["rangefilter"] = rangeFilterQueryParamValue;
    const organicKeywordsQueryParams = { IncludeOrganic: true, IncludePaid: false };
    const paidKeywordsQueryParams = { IncludeOrganic: false, IncludePaid: true };

    const { marketCoreFilters, recommendationsFilters } = filtersConfig;
    const keywordsWinsLimit = marketCoreFilters.find(({ id }) => id === EFiltersTypes.KEYWORD_WINS)
        .apiValue;
    const keywordsLossesLimit = recommendationsFilters.find(
        ({ id }) => id === EFiltersTypes.KEYWORD_LOSSES,
    ).apiValue;
    const limitQueryParams = {
        limits: keywordsWinsLimit + DEFAULT_SEPARATOR + keywordsLossesLimit,
    };
    const enrichFilterDataQueryParams = {
        country,
        webSource,
        sites: keys,
        includeSubDomains,
        to,
        from,
        isWindow,
        ...limitQueryParams,
    };
    const fetchService = DefaultFetchService.getInstance();
    const VENN_DATA_ENDPOINT =
        webSource === devicesTypes.DESKTOP ? VENN_DATA_ENDPOINT_DESKTOP : VENN_DATA_ENDPOINT_MOBILE;
    const totalKeywordsPromise = fetchService.get(VENN_DATA_ENDPOINT, queryParams);
    const organicKeywordsPromise = fetchService.get(VENN_DATA_ENDPOINT, {
        ...queryParams,
        ...organicKeywordsQueryParams,
    });
    const paidKeywordsPromise = fetchService.get(VENN_DATA_ENDPOINT, {
        ...queryParams,
        ...paidKeywordsQueryParams,
    });
    const vennDiagramDataPromises = [
        totalKeywordsPromise,
        organicKeywordsPromise,
        paidKeywordsPromise,
    ];
    const enrichFilterDataTotalPromise = fetchService.get(
        ENRICH_FILTERS_DATA_ENDPOINT,
        enrichFilterDataQueryParams,
    );
    const enrichFilterDataOrganicPromise = fetchService.get(ENRICH_FILTERS_DATA_ENDPOINT, {
        ...enrichFilterDataQueryParams,
        ...organicKeywordsQueryParams,
    });
    const enrichFilterDataPaidPromise = fetchService.get(ENRICH_FILTERS_DATA_ENDPOINT, {
        ...enrichFilterDataQueryParams,
        ...paidKeywordsQueryParams,
    });
    const enrichFilterDataPromises = [
        enrichFilterDataTotalPromise,
        enrichFilterDataOrganicPromise,
        enrichFilterDataPaidPromise,
    ];
    return Promise.all([...vennDiagramDataPromises, ...enrichFilterDataPromises]);
};
