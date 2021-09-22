import {
    IDemographicsApiAgeChartData,
    IDemographicsApiGenderChartData,
    IDemographicsApiParams,
    IDemographicsApiTableData,
} from "../Api/DemographicsApiServiceTypes";
import {
    IAgeChartDistributionData,
    IDemographicsTableRecordData,
    IGenderChartDistributionData,
} from "../industryAnalysisDemographics/IndustryAnalysisDemographicsTypes";
import categoryService from "common/services/categoryService";

export function adaptGenderDistributionChartData(
    genderApiData: IDemographicsApiGenderChartData,
    pageFilters: IDemographicsApiParams,
): IGenderChartDistributionData {
    if (!genderApiData || !genderApiData.Data) {
        return null;
    }

    const { forApi: selectedCategory } = categoryService.categoryQueryParamToCategoryObject(
        pageFilters.category,
    );

    return {
        malePercent: genderApiData.Data[selectedCategory].Male,
        femalePercent: genderApiData.Data[selectedCategory].Female,
    };
}

export function adaptAgeDistributionChartData(
    ageApiData: IDemographicsApiAgeChartData,
    pageFilters: IDemographicsApiParams,
): IAgeChartDistributionData {
    if (!ageApiData || !ageApiData.Data) {
        return null;
    }

    const { forApi: selectedCategory } = categoryService.categoryQueryParamToCategoryObject(
        pageFilters.category,
    );

    return {
        age18To24: ageApiData.Data[selectedCategory].Age18To24,
        age25To34: ageApiData.Data[selectedCategory].Age25To34,
        age35To44: ageApiData.Data[selectedCategory].Age35To44,
        age45To54: ageApiData.Data[selectedCategory].Age45To54,
        age55To64: ageApiData.Data[selectedCategory].Age55To64,
        age65Plus: ageApiData.Data[selectedCategory].Age65Plus,
    };
}

export function adaptDemographicsTableData(
    tableApiData: IDemographicsApiTableData,
    swNavigator: any,
): IDemographicsTableRecordData[] {
    const adaptedData =
        tableApiData?.Data?.map(({ Domain, Favicon, Share, FemaleShare, MaleShare, Ages }) => {
            const recDomainUrl = swNavigator.href("websites-worldwideOverview", {
                ...swNavigator.getParams(),
                key: Domain,
                isWWW: "*",
            });
            const { Age18To24, Age25To34, Age35To44, Age45To54, Age55To64, Age65Plus } = Ages;
            return {
                Domain: Domain,
                favicon: Favicon,
                Share: Share || 0,
                // he key name may miss lead, it's in order to support sorting by the MaleShare column
                MaleShare: [MaleShare, FemaleShare],
                age18To24: Age18To24 * 100 || 0,
                age25To34: Age25To34 * 100 || 0,
                age35To44: Age35To44 * 100 || 0,
                age45To54: Age45To54 * 100 || 0,
                age55To64: Age55To64 * 100 || 0,
                age65Plus: Age65Plus * 100 || 0,
                url: recDomainUrl,
            };
        }) ?? [];

    return adaptedData;
}
