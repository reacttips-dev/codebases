import { filtersConfig } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/constants";
import {
    ETabsTypes,
    IVennDataRow,
} from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { colorsUtilities } from "UtilitiesAndConstants/UtilityFunctions/colorsUtilities";

const DEFAULT_SEPARATOR = ",";
const LIMIT_FILER_SEPARATOR = ";";
const LIMIT_FILTER_HIGH_BAR = "e-1";
const LIMIT_FILTER_LOW_BAR = "0-0";

export const parseEnrichedFilterData = (fetchResults) => ({
    [EFiltersTypes.KEYWORD_WINS]: fetchResults[0],
    [EFiltersTypes.KEYWORD_LOSSES]: fetchResults[1],
});

export const calculateVisitsAmount = (
    filterId,
    vennData: IVennDataRow,
    chosenItems,
    filterEnrichedData,
) => {
    const chosenSite = chosenItems[0].name;
    switch (filterId) {
        case EFiltersTypes.ALL_KEYWORDS:
            return Object.values(vennData).reduce((sum: number, current) => current.Value + sum, 0);
        case EFiltersTypes.CORE_KEYWORDS:
            const sets = Object.keys(vennData).find(
                (f) => f.split(DEFAULT_SEPARATOR).length === chosenItems.length,
            );
            return sets ? vennData[sets].Value : Number();
        case EFiltersTypes.KEYWORD_WINS:
            return filterEnrichedData[EFiltersTypes.KEYWORD_WINS].totalVisits;
        case EFiltersTypes.KEYWORDS_OPPORTUNITIES:
            return Object.entries(vennData)
                .filter((dataObj) => !dataObj[0].includes(chosenSite))
                .reduce((sum: number, dataObj) => sum + dataObj[1].Value, 0);
        case EFiltersTypes.KEYWORD_LOSSES:
            return filterEnrichedData[EFiltersTypes.KEYWORD_LOSSES].totalVisits;
    }
};

export const getSelectedTabData = (selectedTabIndex, filterData) => {
    const { organic: organicFilterData, paid: paidFilterData, total: totalFilterData } = filterData;
    switch (selectedTabIndex) {
        case ETabsTypes.ALL_TRAFFIC:
            return totalFilterData;
        case ETabsTypes.ORGANIC:
            return organicFilterData;
        case ETabsTypes.PAID:
            return paidFilterData;
    }
};

export const getSetsColor = (chosenItems) => (setsArray) => {
    if (setsArray.length === 1) {
        return chosenItems.find(
            ({ name, Domain }) => name === setsArray[0] || Domain === setsArray[0],
        ).color;
    }
    return colorsUtilities.multiplyHexColors(
        getSetsColor(chosenItems)(setsArray.slice(0, 1)),
        getSetsColor(chosenItems)(setsArray.slice(1)),
    );
};

export const setsAreEqual = (setA, setB) => {
    const sortedSetArrayA = setA.split(DEFAULT_SEPARATOR).sort();
    const sortedSetArrayB = setB.split(DEFAULT_SEPARATOR).sort();
    return sortedSetArrayA.join() === sortedSetArrayB.join();
};

const isSetSubsetOfSetArray = (set, setsArray) => {
    let results = true;
    const keyArray = set.split(DEFAULT_SEPARATOR);
    setsArray.map((set) => {
        if (!keyArray.includes(set)) {
            results = false;
        }
    });
    return results;
};

const getIntersectionValue = (setsArray, apiResults, chosenItems) => {
    const setsKey = setsArray.join();
    const setKeywordsAmount = apiResults[setsKey].Count;
    if (setsArray.length === chosenItems.length) {
        return setKeywordsAmount;
    }
    const biggerSubsetsFilter = (set) =>
        isSetSubsetOfSetArray(set, setsArray) &&
        set.split(DEFAULT_SEPARATOR).length > setsArray.length;

    const biggerSubsets = Object.keys(apiResults).filter(biggerSubsetsFilter);
    return (
        setKeywordsAmount -
        biggerSubsets.reduce((sum, set) => {
            return (
                sum + getIntersectionValue(set.split(DEFAULT_SEPARATOR), apiResults, chosenItems)
            );
        }, 0)
    );
};

export const apiResultsToHighChartsStructureParser = (
    apiResults: IVennDataRow,
    siteLegends,
    onClickCallback,
    selectedIntersectionSets,
    chosenItems,
) => {
    const maxKeywordsCount = Object.keys(apiResults).length
        ? Object.entries(apiResults).sort((a, b) => (a[1].Count > b[1].Count ? -1 : 1))[0][1].Count
        : 0;
    const highChartsStructuredData = Object.entries(apiResults).map((objectEntry) => {
        const sets = objectEntry[0];
        const setsArray = sets.split(DEFAULT_SEPARATOR);
        const isSelected = selectedIntersectionSets && setsAreEqual(selectedIntersectionSets, sets);
        const { Count: keywordsCount, Value: trafficShareValue } = objectEntry[1];
        return {
            sets: setsArray,
            //the following calculate is in order to set the maximum ratio between the smallest sets to the largest one to be 1:2
            value: keywordsCount + maxKeywordsCount / 2,
            intersectionValue: getIntersectionValue(setsArray, apiResults, chosenItems),
            searchVisits: trafficShareValue,
            chosenItemsAmount: chosenItems.length,
            dataLabels: {
                enabled: false,
            },
            events: {
                click: onClickCallback,
            },
            color: getSetsColor(chosenItems)(setsArray),
            borderWidth: isSelected ? "3px" : "1px",
            opacity: selectedIntersectionSets ? (isSelected ? 1 : 0.2) : 1,
        };
    });
    const isHiddenLegendsObject = Object.fromEntries(
        siteLegends.map(({ name, hidden }) => [name, hidden]),
    );
    return highChartsStructuredData.filter(
        ({ sets }) => sets.filter((set) => !isHiddenLegendsObject[set]).length === sets.length,
    );
};

export const getQueryParamsBasedOnPredefinedFilters = (id, chosenItems) => {
    let limits;
    const { marketCoreFilters, recommendationsFilters } = filtersConfig;
    switch (id) {
        case EFiltersTypes.ALL_KEYWORDS:
            limits = undefined;
            break;
        case EFiltersTypes.CORE_KEYWORDS:
            limits = "e-1;".repeat(chosenItems.length).slice(0, -1);
            break;
        case EFiltersTypes.KEYWORD_WINS:
            limits = marketCoreFilters.find(({ id }) => id === EFiltersTypes.KEYWORD_WINS).apiValue;
            break;
        case EFiltersTypes.KEYWORDS_OPPORTUNITIES:
            limits = recommendationsFilters.find(
                ({ id }) => id === EFiltersTypes.KEYWORDS_OPPORTUNITIES,
            ).apiValue;
            break;
        case EFiltersTypes.KEYWORD_LOSSES:
            limits = recommendationsFilters.find(({ id }) => id === EFiltersTypes.KEYWORD_LOSSES)
                .apiValue;
            break;
    }
    return { limitsUsingAndOperator: limits };
};

export const getQueryParamsBasedOnIntersection = (selectedIntersectionSets, chosenItems) => {
    const limitsArray = chosenItems.reduce(
        (tempArray, { name }) => [
            ...tempArray,
            selectedIntersectionSets.includes(name) ? LIMIT_FILTER_HIGH_BAR : LIMIT_FILTER_LOW_BAR,
        ],
        [],
    );
    const limitsString = limitsArray.join(LIMIT_FILER_SEPARATOR);
    return { limitsUsingAndOperator: limitsString };
};

export const getOrganicPaidValues = (tabId) => {
    switch (tabId) {
        case ETabsTypes.ALL_TRAFFIC:
            return { IncludeOrganic: true, IncludePaid: true };
        case ETabsTypes.ORGANIC:
            return { IncludeOrganic: true, IncludePaid: false };
        case ETabsTypes.PAID:
            return { IncludeOrganic: false, IncludePaid: true };
    }
};
