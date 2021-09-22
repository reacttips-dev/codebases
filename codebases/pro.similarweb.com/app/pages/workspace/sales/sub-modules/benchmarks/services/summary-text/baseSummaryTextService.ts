import { i18nFilter } from "filters/ngFilters";
import { formatLargeNumber } from "../../helpers";
import { METRICS_TRANSLATION_KEY } from "../../constants";
import createBaseItemService from "../benchmark-item/baseItemService";
import {
    BenchmarkSummaryPlaceholders,
    BenchmarkSummaryTexts,
    BenchmarkType,
} from "../../types/benchmarks";

const createBaseSummaryTextService = (
    itemService: ReturnType<typeof createBaseItemService>,
    numberOfCountries: number,
    numberOfSimilarSites: number,
) => {
    const TRANSLATION_KEY = `${METRICS_TRANSLATION_KEY}.{benchmark}`;
    const PROSPECT_IS_LOSING_KEY = `${TRANSLATION_KEY}.p_losing`;
    const PROSPECT_IS_WINNING_KEY = `${TRANSLATION_KEY}.p_winning`;
    const translate = i18nFilter();
    const replacements = buildReplacements();
    /**
     * Replace benchmark metric placeholder inside translation key
     * @param metric
     */
    const getBenchmarkReplacer = (metric: BenchmarkType["metric"]) => {
        return (string: string) => {
            return string.replace("{benchmark}", metric);
        };
    };

    function buildReplacements(): BenchmarkSummaryPlaceholders {
        return {
            numberOfCountries,
            numberOfSimilarSites,
            prospectDomain: itemService.formattedProspect.domain,
            prospectValue: itemService.formattedProspect.value,
            prospectTotalVisits: formatLargeNumber(itemService.prospect.visits),
            cAverage: itemService.formattedAverage,
            gap: itemService.formattedOpportunity,
            country: itemService.countryName,
            calculatedGap: formatLargeNumber(
                Math.abs(itemService.opportunity * itemService.prospect.visits),
            ),
            absoluteGap: formatLargeNumber(
                Math.abs(itemService.average - itemService.prospect.value),
            ),
            comparedCompetitors: itemService.currentCompetitors.length,
        };
    }

    return {
        get replacements() {
            return replacements;
        },
        getTexts(
            customReplacements: { [key: string]: string | number } = {},
        ): BenchmarkSummaryTexts {
            const replaceBenchmark = getBenchmarkReplacer(itemService.bResult.metric);
            const allReplacements = { ...this.replacements, ...customReplacements };

            if (itemService.isProspectLosing) {
                const text = translate(
                    replaceBenchmark(PROSPECT_IS_LOSING_KEY) + ".text",
                    allReplacements,
                );
                const tooltip = translate(
                    replaceBenchmark(PROSPECT_IS_LOSING_KEY) + ".tooltip",
                    allReplacements,
                );

                return {
                    text,
                    tooltip,
                };
            }

            if (numberOfCountries === 1) {
                const text = translate(
                    replaceBenchmark(PROSPECT_IS_WINNING_KEY) + ".text.s_country",
                    allReplacements,
                );

                return { text };
            }

            const text = translate(
                replaceBenchmark(PROSPECT_IS_WINNING_KEY) + ".text.m_countries",
                allReplacements,
            );

            return { text };
        },
    };
};

export default createBaseSummaryTextService;
