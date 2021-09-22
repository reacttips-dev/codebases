import { colorsPalettes } from "@similarweb/styles";
import { BENCHMARK_ITEM_KEY } from "../../constants";
import { ICountryService } from "services/CountryService";
import { BenchmarkResultType } from "../../types/benchmarks";
import { OpportunityModeServiceType } from "../opportunity-mode/types";
import createBaseTableService from "../table/baseTableService";
import createBaseSummaryTextService from "../summary-text/baseSummaryTextService";
import {
    formatAsPercents,
    getCompetitorsLabelsColors,
    getProspectLabelColor,
    getSummaryValueFormatterByUnits,
    getUniqueBenchmarkId,
} from "../../helpers";

const createBaseItemService = (
    bResult: BenchmarkResultType,
    opportunityModeService: OpportunityModeServiceType,
    countryService: ICountryService,
    numberOfCountries: number,
    numberOfSimilarSites: number,
) => {
    /** Unique id for given benchmark result */
    const id = getUniqueBenchmarkId(bResult);
    /**
     * Universal function that should be used to format any value inside given benchmark result.
     * Is based on "units" property.
     */
    const formatValue = getSummaryValueFormatterByUnits(bResult.benchmark.units);
    /** Full country name */
    const countryName = countryService.getCountryById(bResult.country)?.text ?? "";
    /** Correct "aggregatedDetails" object to use, for instance, to get competitors */
    const aggregatedDetails = opportunityModeService.aggregatedDetails;
    /** Full competitors objects that are ready to use in chart/table views  */
    const currentCompetitors = buildCurrentCompetitors();
    /** Correct average value based on selected opportunity mode */
    const average = aggregatedDetails?.avgValue;
    /** Correct points value based on selected opportunity mode */
    const points = aggregatedDetails?.points;
    /** Correct opportunity value based on selected opportunity mode */
    const opportunity = aggregatedDetails?.opportunity;
    /**
     * Build full competitors objects based on opportunity mode selection
     */
    function buildCurrentCompetitors() {
        const domains = aggregatedDetails?.domains ?? [];

        return domains
            .map((domain) => {
                return bResult.competitors.find((c) => c.domain === domain);
            })
            .filter(Boolean);
    }

    return {
        get id() {
            return id;
        },
        get bResult() {
            return {
                country: bResult.country,
                currData: bResult.dataDate,
                units: bResult.benchmark.units,
                topic: bResult.benchmark.topic,
                metric: bResult.benchmark.metric,
                competitors: bResult.competitors,
                greaterIsBetter: bResult.benchmark.greaterIsBetter,
                outperformingCompetitors: bResult.outperformingCompetitors,
            };
        },
        get points() {
            return points ?? 0;
        },
        get average() {
            return average;
        },
        get opportunity() {
            return opportunity;
        },
        get countryName() {
            return countryName;
        },
        get currentCompetitors() {
            return currentCompetitors;
        },
        get aggregatedDetails() {
            return aggregatedDetails;
        },
        get isProspectLosing() {
            return opportunity > 0;
        },
        get defaultFormatter() {
            return formatValue;
        },
        get formattedAverage() {
            if (typeof average === "undefined") {
                return "N/A";
            }

            return formatValue(average);
        },
        get formattedOpportunity() {
            if (typeof opportunity === "undefined") {
                return "N/A";
            }

            return opportunityModeService.prefixOpportunityValueSign(
                formatAsPercents(Math.abs(opportunity)),
            );
        },
        get prospect() {
            return bResult.prospect;
        },
        get formattedProspect() {
            const { domain, value } = bResult.prospect;

            return {
                domain,
                color: getProspectLabelColor(),
                value: formatValue(value),
            };
        },
        get opportunityColor() {
            if (this.isProspectLosing) {
                return colorsPalettes.green["s100"];
            }

            return colorsPalettes.carbon["500"];
        },
        get opportunityTitleKey() {
            return opportunityModeService.opportunityTitleKey;
        },
        get competitorsColors() {
            return getCompetitorsLabelsColors();
        },
        get competitorsAverageColor() {
            if (currentCompetitors.length === 1) {
                return this.competitorsColors[0];
            }

            return colorsPalettes.navigation["ICON_BAR_BACKGROUND"];
        },
        get competitorsAverageTitleKey() {
            if (currentCompetitors.length === 1) {
                return currentCompetitors[0]?.domain ?? "";
            }

            return `${BENCHMARK_ITEM_KEY}.average`;
        },
        getTable() {
            return createBaseTableService(this);
        },
        getSummaryTextService() {
            return createBaseSummaryTextService(this, numberOfCountries, numberOfSimilarSites);
        },
    };
};

export default createBaseItemService;
