import { SupportedFilterKey } from "../types/filters";
import {
    AVERAGE_PAGES_PER_VISIT_OPTIONS,
    MAX_OPTION_VALUE,
} from "pages/lead-generator/lead-generator-new/filters-options";

const EMPLOYEE_COUNT_OPTIONS = [0, 10, 50, 200, 500, 1_000, 5_000, 10_000, MAX_OPTION_VALUE];
const ANNUAL_REVENUE_OPTIONS = [
    0,
    1_000_000,
    5_000_000,
    10_000_000,
    15_000_000,
    25_000_000,
    50_000_000,
    75_000_000,
    100_000_000,
    200_000_000,
    1_000_000_000,
    MAX_OPTION_VALUE,
];
const MONTHLY_VISITS_OPTIONS = [
    0,
    5_000,
    10_000,
    15_000,
    20_000,
    25_000,
    30_000,
    35_000,
    40_000,
    45_000,
    50_000,
    60_000,
    70_000,
    80_000,
    90_000,
    100_000,
    150_000,
    200_000,
    250_000,
    300_000,
    350_000,
    400_000,
    450_000,
    500_000,
    750_000,
    1_000_000,
    5_000_000,
    10_000_000,
    50_000_000,
    100_000_000,
    500_000_000,
    MAX_OPTION_VALUE,
];
const AVG_VISIT_DURATION_OPTIONS = [0, 15, 30, 45]
    .concat(
        [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map(
            (minutes) => minutes * 60,
        ),
    )
    .concat(MAX_OPTION_VALUE);

export const RANGE_PERCENTS_FILTERS_KEYS: SupportedFilterKey[] = [
    "bounceRate",
    "mobileWebVisitsShare",
    "directShare",
    "displayAdsShare",
    "paidSearchShare",
    "organicSearchShare",
    "referralsShare",
    "socialShare",
];

export const RANGE_NUMBERS_FILTERS_CONFIG = {
    monthlyVisits: MONTHLY_VISITS_OPTIONS,
    uniqueVisitors: MONTHLY_VISITS_OPTIONS,
    totalPageViews: MONTHLY_VISITS_OPTIONS,
    avgPagesPerVisit: AVERAGE_PAGES_PER_VISIT_OPTIONS,
    employeeCount: EMPLOYEE_COUNT_OPTIONS,
    annualRevenue: ANNUAL_REVENUE_OPTIONS,
};

export const RANGE_DURATION_FILTERS_CONFIG = {
    avgVisitDuration: AVG_VISIT_DURATION_OPTIONS,
};
