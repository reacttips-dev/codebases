import CountryService from "services/CountryService";
import { isGrowthBenchmark } from "../../helpers";
import { BenchmarkResultType } from "../../types/benchmarks";
import createOpportunityModeService from "../opportunity-mode/opportunityModeServiceFactory";
import createGrowthItemService from "../benchmark-item/growthItemService";
import createBaseItemService from "../benchmark-item/baseItemService";

const createBenchmarkItemService = (
    bResult: BenchmarkResultType,
    opportunityModeService: ReturnType<typeof createOpportunityModeService>,
    numberOfCountries: number,
    numberOfSimilarSites: number,
) => {
    if (isGrowthBenchmark(bResult)) {
        return createGrowthItemService(
            bResult,
            opportunityModeService,
            CountryService,
            numberOfCountries,
            numberOfSimilarSites,
        );
    }

    return createBaseItemService(
        bResult,
        opportunityModeService,
        CountryService,
        numberOfCountries,
        numberOfSimilarSites,
    );
};

export default createBenchmarkItemService;
