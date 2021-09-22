import { colorsPalettes, rgba } from "@similarweb/styles";
import { ChartAxisRangeType } from "../../types/chart";
import { i18nFilter } from "filters/ngFilters";
import createBenchmarkItemService from "../benchmark-item/benchmarkItemServiceFactory";
import {
    addUnitAtTheEnd,
    getChartHeightByCompetitorsCount,
    reduceByCompetitorValue,
} from "../../helpers";
import {
    BENCHMARK_AVG_COLOR,
    BENCHMARK_COMPETITORS_COLORS,
    BENCHMARK_COMPETITORS_MAX_COUNT,
    BENCHMARK_ITEM_KEY,
    BENCHMARK_PROSPECT_COLOR,
    BenchmarksValuesUnits,
} from "../../constants";

export const createBarChartService = (
    itemService: ReturnType<typeof createBenchmarkItemService>,
) => {
    const DEFAULT_BAR_WIDTH = 12;
    const AVG_BAR_INDEX_MIN = 1.02;
    const AVG_BAR_INDEX_MAX = 1.07;
    const PROSPECT_BAR_INDEX = 0.45;
    const Y_AXIS_EXTRA_SPACE_MULTIPLIER = 0.1;
    const BENCHMARKS_CHART_BAR_STEP_MAX = 0.1;
    const BENCHMARKS_CHART_BAR_STEP_MIN = 0.05;
    const BENCHMARKS_CHART_BAR_BASE_INDEX = 0.9;
    const {
        bResult: { units },
        prospect,
        average,
        defaultFormatter,
        currentCompetitors,
    } = itemService;
    const translate = i18nFilter();
    /**
     * Get all displayed values
     */
    function getBenchmarkValues() {
        return currentCompetitors.reduce(reduceByCompetitorValue, [prospect.value]);
    }
    /**
     * If min is > 0 and difference between min and extra is less than 0 - return much smaller value
     */
    function adjustYAxisMin(min: number, extra: number) {
        const minWithSpan = min - extra;

        if (min >= 0) {
            return 0 - extra;
        }

        if (minWithSpan < 0 && min >= 0) {
            return minWithSpan * 0.1;
        }

        return minWithSpan;
    }
    /**
     * Bar padding for avg bar
     */
    function getAvgBarPadding(competitorsCount: number) {
        if (competitorsCount === BENCHMARK_COMPETITORS_MAX_COUNT) {
            return 45;
        }

        return 25;
    }
    /**
     * Returns indices for every "competitor" bar
     * @param count
     */
    function getBarsIndices(count: number) {
        const indices = new Array(count).fill(BENCHMARKS_CHART_BAR_BASE_INDEX);

        if (count === BENCHMARK_COMPETITORS_MAX_COUNT) {
            return indices.map(getChartBarsIndicesMapper(BENCHMARKS_CHART_BAR_STEP_MAX));
        }

        return indices.map(getChartBarsIndicesMapper(BENCHMARKS_CHART_BAR_STEP_MIN));
    }
    /**
     * Builds a "competitor" bar entry for the chart
     */
    function createRegularEntry(name: string, value: number, index = 0, count = 1) {
        const indices = getBarsIndices(count);

        return {
            name,
            data: [null, [indices[index], value]],
            color: BENCHMARK_COMPETITORS_COLORS[index],
        };
    }
    /**
     * Builds a "prospect" bar entry for the chart
     */
    function createProspectEntry() {
        return {
            color: BENCHMARK_PROSPECT_COLOR,
            name: prospect.domain,
            data: [[PROSPECT_BAR_INDEX, parseValueByUnits(prospect.value)], null],
        };
    }
    /**
     * Builds a "average" bar entry for the chart
     */
    function createAverageEntry() {
        const competitorsCount = currentCompetitors.length;
        const index = competitorsCount <= 2 ? AVG_BAR_INDEX_MIN : AVG_BAR_INDEX_MAX;

        return {
            zIndex: -1,
            grouping: false,
            isCategorySeries: true,
            color: BENCHMARK_AVG_COLOR,
            data: [null, [index, parseValueByUnits(average)]],
            name: translate(`${BENCHMARK_ITEM_KEY}.average`),
            pointWidth: competitorsCount * DEFAULT_BAR_WIDTH + getAvgBarPadding(competitorsCount),
        };
    }
    /**
     * Calculates Y axis min and max values
     */
    function getYAxisMinMax(): ChartAxisRangeType {
        const values = getBenchmarkValues().map(parseValueByUnits);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const axisExtraSpace = (max - min) * Y_AXIS_EXTRA_SPACE_MULTIPLIER;

        return {
            min: adjustYAxisMin(min, axisExtraSpace),
            max: max + axisExtraSpace,
            extra: axisExtraSpace,
        };
    }
    /**
     * Builds ticks for the chart (always 3).
     */
    function getTicks(yAxisRange: ChartAxisRangeType) {
        const { min, max, extra } = yAxisRange;
        const end = max - extra;
        let start: number;
        let middle: number;

        if (min === 0) {
            start = 0;
        } else {
            start = min + extra;
        }

        if (min < 0 && start < 0) {
            middle = 0;
        } else {
            middle = min + (max - min) / 2;
        }

        return [start, middle, end];
    }
    /**
     * Returns labels formatter function based on units of given benchmark
     */
    function getYAxisLabelsFormatter() {
        const hasNegative = getBenchmarkValues().some((value) => value < 0);

        return function () {
            if (this.value === 0) {
                if (!hasNegative) {
                    return addUnitAtTheEnd(units)(this.value);
                }

                return null;
            }
            // Special case for percents
            // "this.value" is an axis tick value
            // In case it was a percent we already multiply it by 100 earlier
            // So we need to revert it here for proper formatting
            if (units === BenchmarksValuesUnits.PERCENT) {
                return defaultFormatter(this.value / 100);
            }

            return defaultFormatter(this.value);
        };
    }
    /**
     * Map bar indices correctly
     */
    function getChartBarsIndicesMapper(step: number) {
        return function mapIndices(value: number, i: number) {
            return value + step * i;
        };
    }
    /**
     * Special value parsing for percents
     */
    function parseValueByUnits(value: number) {
        if (units === BenchmarksValuesUnits.PERCENT) {
            return value * 100;
        }

        return value;
    }

    return {
        get id() {
            return itemService.id;
        },
        get competitorsCount() {
            return itemService.currentCompetitors.length;
        },
        get height() {
            return getChartHeightByCompetitorsCount(this.competitorsCount);
        },
        /**
         * Builds data series for the chart
         */
        getSeries() {
            if (currentCompetitors.length === 0) {
                return [];
            }

            const prospectEntry = createProspectEntry();

            if (currentCompetitors.length === 1) {
                const [{ domain, value }] = currentCompetitors;
                const competitorEntry = createRegularEntry(domain, parseValueByUnits(value));

                return [prospectEntry, competitorEntry];
            }

            const averageEntry = createAverageEntry();

            return [
                prospectEntry,
                ...currentCompetitors.map(({ domain, value }, i, array) => {
                    return createRegularEntry(domain, parseValueByUnits(value), i, array.length);
                }),
                averageEntry,
            ];
        },
        /**
         * Builds a config for the chart
         */
        getConfig() {
            const { min, max, extra } = getYAxisMinMax();
            const yAxisLabelsFormatter = getYAxisLabelsFormatter();
            const yAxisTickPositioner = () => getTicks({ min, max, extra });

            return {
                chart: {
                    type: "bar",
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 0,
                    marginBottom: 35,
                    spacingLeft: 0,
                    spacingRight: 0,
                },
                legend: { enabled: false },
                xAxis: {
                    minPadding: 0,
                    maxPadding: 0,
                    categories: ["Prospect", "Competitors"],
                    title: {
                        text: null,
                    },
                    visible: false,
                    zoomEnabled: false,
                    min: 0.45,
                },
                plotOptions: {
                    series: {
                        pointWidth: DEFAULT_BAR_WIDTH,
                        borderWidth: 0,
                        borderRadius: 0,
                        enableMouseTracking: false,
                    },
                },
                yAxis: {
                    minPadding: 0,
                    maxPadding: 0,
                    endOnTick: false,
                    startOnTick: false,
                    zoomEnabled: false,
                    tickColor: rgba(colorsPalettes.carbon["500"], 0.2),
                    labels: {
                        style: {
                            color: rgba(colorsPalettes.carbon["500"], 0.4),
                        },
                        formatter: yAxisLabelsFormatter,
                    },
                    tickPositioner: yAxisTickPositioner,
                    min,
                    max,
                },
            };
        },
    };
};

export default createBarChartService;
