import createGrowthItemService from "../benchmark-item/growthItemService";
import createBaseSummaryTextService from "./baseSummaryTextService";
import { formatAsPercents, formatLargeNumber } from "../../helpers";

const createGrowthSummaryTextService = (
    itemService: ReturnType<typeof createGrowthItemService>,
    numberOfCountries: number,
    numberOfSimilarSites: number,
) => {
    const baseSummaryTextService = createBaseSummaryTextService(
        itemService,
        numberOfCountries,
        numberOfSimilarSites,
    );
    const replacements = { ...baseSummaryTextService.replacements, ...buildReplacements() };

    function buildReplacements() {
        const { prevVisits, visits } = itemService.prospect;
        const prevVisitsSum = itemService.currentCompetitors.reduce(
            (sum, c) => sum + c.prevVisits,
            prevVisits,
        );
        const visitsSum = itemService.currentCompetitors.reduce((sum, c) => sum + c.visits, visits);

        return {
            prospectPrev: formatLargeNumber(prevVisits),
            pPrevArenaShare: formatAsPercents(prevVisits / prevVisitsSum),
            pCurrArenaShare: formatAsPercents(visits / visitsSum),
        };
    }

    return {
        ...baseSummaryTextService,
        get replacements() {
            return replacements;
        },
    };
};

export default createGrowthSummaryTextService;
