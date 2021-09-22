import { i18nFilter } from "filters/ngFilters";
import { formatLargeNumber } from "../../helpers";
import { BenchmarkType } from "../../types/benchmarks";
import createBaseItemService from "../benchmark-item/baseItemService";
import {
    BENCHMARK_ITEM_TABLE_KEY,
    BENCHMARK_VISITS_METRIC_NAME,
    METRICS_TRANSLATION_KEY,
} from "../../constants";
import { TableCell } from "pages/workspace/sales/components/custom-table/types";

const createBaseTableService = (itemService: ReturnType<typeof createBaseItemService>) => {
    const translate = i18nFilter();
    const MONTHLY_VISITS_COLUMN_KEY = "monthly_visits";

    const createMetricColumn = (metric: BenchmarkType["metric"]) => {
        return {
            [metric]: {
                text: translate(`${METRICS_TRANSLATION_KEY}.${metric}.title`),
                align: "right",
            },
        };
    };

    const createMonthlyVisitsEntry = (value: number) => {
        return { [MONTHLY_VISITS_COLUMN_KEY]: formatLargeNumber(value) };
    };

    const createMonthlyVisitsColumn = () => {
        return {
            [MONTHLY_VISITS_COLUMN_KEY]: {
                text: translate(`${BENCHMARK_ITEM_TABLE_KEY}.column.${MONTHLY_VISITS_COLUMN_KEY}`),
                size: "100px",
                align: "right",
            },
        };
    };

    const getMonthlyVisitsData = () => {
        const prospectEntry = createMonthlyVisitsEntry(itemService.prospect.visits);
        const competitorsEntries = itemService.currentCompetitors.map((c) =>
            createMonthlyVisitsEntry(c.visits),
        );

        return [prospectEntry].concat(competitorsEntries);
    };

    const getBenchmarkValuesData = () => {
        const metric = itemService.bResult.metric;
        const { value } = itemService.formattedProspect;
        const prospectEntry = { [metric]: value };
        const competitorsEntries = itemService.currentCompetitors.map((c) => ({
            [metric]: itemService.defaultFormatter(c.value),
        }));

        return [prospectEntry].concat(competitorsEntries);
    };

    return {
        getData(): { [key: string]: string | number }[] {
            const monthlyVisitsData = getMonthlyVisitsData();
            const metric = itemService.bResult.metric;

            // Special case with a single column for visits metric
            if (BENCHMARK_VISITS_METRIC_NAME === metric) {
                return monthlyVisitsData;
            }

            // Default 2 columns case for all other metrics
            const benchmarkValuesData = getBenchmarkValuesData();

            return benchmarkValuesData.map((entry, i) => ({
                ...entry,
                ...monthlyVisitsData[i],
            }));
        },
        getColumns(): { [name: string]: TableCell } {
            const monthlyVisitsColumn = createMonthlyVisitsColumn();
            const metric = itemService.bResult.metric;

            // Special case with a single column for visits metric
            if (BENCHMARK_VISITS_METRIC_NAME === metric) {
                return monthlyVisitsColumn;
            }

            // Default 2 columns case for all other metrics
            return {
                ...createMetricColumn(metric),
                ...monthlyVisitsColumn,
            };
        },
    };
};

export default createBaseTableService;
