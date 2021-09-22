import { ICountryService } from "services/CountryService";
import { BenchmarkResultGrowthType } from "../../types/benchmarks";
import { OpportunityModeServiceType } from "../opportunity-mode/types";
import { BenchmarkCompetitorGrowthType } from "../../types/competitors";
import dateTimeService from "services/date-time/dateTimeService";
import createBaseItemService from "./baseItemService";
import createGrowthItemTableService from "../table/growthTableService";
import createGrowthSummaryTextService from "../summary-text/growthSummaryTextService";

const createGrowthItemService = (
    bResult: BenchmarkResultGrowthType,
    opportunityModeService: OpportunityModeServiceType,
    countryService: ICountryService,
    numberOfCountries: number,
    numberOfSimilarSites: number,
) => {
    const baseItemService = createBaseItemService(
        bResult,
        opportunityModeService,
        countryService,
        numberOfCountries,
        numberOfSimilarSites,
    );

    return {
        ...baseItemService,
        get prospect() {
            return bResult.prospect;
        },
        get currentCompetitors() {
            return baseItemService.currentCompetitors as BenchmarkCompetitorGrowthType[];
        },
        get prevDate() {
            return bResult.prevDate;
        },
        get currDate() {
            return bResult.dataDate;
        },
        getTable() {
            return createGrowthItemTableService(this, dateTimeService);
        },
        getSummaryTextService() {
            return createGrowthSummaryTextService(this, numberOfCountries, numberOfSimilarSites);
        },
    };
};

export default createGrowthItemService;
