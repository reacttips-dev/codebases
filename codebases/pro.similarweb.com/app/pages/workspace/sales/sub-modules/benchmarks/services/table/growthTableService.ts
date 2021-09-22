import { i18nFilter } from "filters/ngFilters";
import { formatLargeNumber } from "../../helpers";
import { BENCHMARK_ITEM_TABLE_KEY } from "../../constants";
import { BenchmarkCompetitorGrowthType } from "../../types/competitors";
import createGrowthItemService from "../benchmark-item/growthItemService";
import { TableCell } from "pages/workspace/sales/components/custom-table/types";

const createGrowthItemTableService = (
    growthItemService: ReturnType<typeof createGrowthItemService>,
    dateTimeService: { formatWithMoment(date: string | Date, format: string): string },
) => {
    const translate = i18nFilter();
    const CHANGE_COLUMN_KEY = "change";

    const createProspectGrowthEntry = () => {
        const { prevVisits, visits, value } = growthItemService.prospect;

        return {
            [growthItemService.prevDate]: formatLargeNumber(prevVisits),
            [growthItemService.currDate]: formatLargeNumber(visits),
            [CHANGE_COLUMN_KEY]: value,
        };
    };

    const createCompetitorGrowthEntry = (competitor: BenchmarkCompetitorGrowthType) => {
        return {
            [growthItemService.prevDate]: formatLargeNumber(competitor.prevVisits),
            [growthItemService.currDate]: formatLargeNumber(competitor.visits),
            [CHANGE_COLUMN_KEY]: competitor.value,
        };
    };

    const createChangeColumn = () => {
        return {
            [CHANGE_COLUMN_KEY]: {
                text: translate(`${BENCHMARK_ITEM_TABLE_KEY}.column.${CHANGE_COLUMN_KEY}`),
                align: "right",
            },
        };
    };

    const createDateColumn = (date: string) => {
        const formattedDate = dateTimeService.formatWithMoment(date, "MMM YYYY");

        return {
            [date]: {
                text: formattedDate,
                size: "85px",
                align: "right",
            },
        };
    };

    return {
        getData() {
            const prospectEntry = createProspectGrowthEntry();
            const competitorsEntries = growthItemService.currentCompetitors.map((c) =>
                createCompetitorGrowthEntry(c),
            );

            return [prospectEntry].concat(competitorsEntries);
        },
        getColumns(): { [name: string]: TableCell } {
            const prevDateHeader = createDateColumn(growthItemService.prevDate);
            const currDateHeader = createDateColumn(growthItemService.currDate);
            const changeColumnHeader = createChangeColumn();

            return {
                ...prevDateHeader,
                ...currDateHeader,
                ...changeColumnHeader,
            };
        },
    };
};

export default createGrowthItemTableService;
