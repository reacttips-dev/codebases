import _ from "lodash";
import { IDemographicsTableRecordData } from "../../industryAnalysisDemographics/IndustryAnalysisDemographicsTypes";
import { ITableColumnSelection, ITableData } from "./DemographicsTableTypes";

const TABLE_DEFAULT_MAX_PERCENT = 100;
const TABLE_DEFAULT_MIN_PERCENT = 0;

/**
 * Escapes the given domain string, so that we could run regex search on it without
 * worrying that it might include special characters
 */
const escapeRegexString = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Sorts all table records according to the given column selection
 */
const sortTableRecords = (
    tableRecords: IDemographicsTableRecordData[],
    sortBy: ITableColumnSelection,
) => {
    if (!sortBy) {
        return tableRecords;
    }

    return _.orderBy(tableRecords, sortBy.field, sortBy.sortDirection);
};

/**
 * Filters out table records according to the provided filter string (filter by records domain name)
 * @param tableRecords All table records that (before filtering)
 * @param filterByDomain User input to filter out records according to their domain name
 */
const filterTableRecords = (
    tableRecords: IDemographicsTableRecordData[],
    filterByDomain: string,
): IDemographicsTableRecordData[] => {
    if (!filterByDomain) {
        return tableRecords;
    }

    const regexInput = escapeRegexString(filterByDomain);
    const filterRegex = new RegExp(`(${regexInput})`, "i");
    return tableRecords.filter((rec) => filterRegex.test(rec.Domain));
};

const calculateMaxAndMinValues = (tableRecords: IDemographicsTableRecordData[]) => {
    // We want to find what's the max/min age percent for the entire table. these values will be used
    // to normalize the heatmap, so that the table cell with the maximum percent will have the boldest color,
    // and the table cell with the minimum percent will have the lightest color.
    const allAgePercents = tableRecords.reduce(
        (res: number[], curr: IDemographicsTableRecordData) => {
            return [
                ...res,
                curr.age18To24,
                curr.age25To34,
                curr.age35To44,
                curr.age45To54,
                curr.age55To64,
                curr.age65Plus,
            ];
        },
        [],
    );

    const hasData = allAgePercents.length > 0;
    const maxAgePercent = hasData ? Math.max(...allAgePercents) : TABLE_DEFAULT_MAX_PERCENT;
    const minAgePercent = hasData ? Math.min(...allAgePercents) : TABLE_DEFAULT_MIN_PERCENT;

    return {
        maxAgePercent,
        minAgePercent,
    };
};

export const buildTableData = (
    tableRecords: IDemographicsTableRecordData[],
    sortBy: ITableColumnSelection,
    filterByDomain: string,
): ITableData => {
    if (!tableRecords) {
        return null;
    }

    let filteredRecords = filterTableRecords(tableRecords, filterByDomain);
    filteredRecords = sortTableRecords(filteredRecords, sortBy);

    const { maxAgePercent, minAgePercent } = calculateMaxAndMinValues(filteredRecords);

    return {
        Records: filteredRecords,
        TotalCount: filteredRecords.length,
        maxCellValue: maxAgePercent,
        minCellValue: minAgePercent,
    };
};
