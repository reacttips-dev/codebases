import { customDurationList } from "pages/sales-intelligence/pages/find-leads/components/IndustryLeads/IndustyResult/configs/allConfigs";
import DurationService from "services/DurationService";
import * as queryString from "query-string";
import { dataParamsAdapter } from "pages/sales-intelligence/pages/find-leads/components/utils";
import { TableMetaDataConfig } from "pages/sales-intelligence/pages/find-leads/components/IndustryLeads/IndustyResult/types";
import { IndustryParamsRequest, NavigationParams } from "../types";

export type InitialIndustryParamsProps = NavigationParams & {
    table: string;
    searchTypeParam: string;
    orderby?: string;
};

export const industriesParamsService = (tableMetaData: TableMetaDataConfig) => {
    const FORMAT_DATE = "YYYY|MM|DD";

    return {
        getInitialIndustryParams({
            country,
            duration,
            category,
            webSource,
            orderby = "Share desc",
            table,
            searchTypeParam,
        }: InitialIndustryParamsProps): IndustryParamsRequest {
            const rawDate = DurationService.getDurationData(duration).raw.to.clone();
            const currentMonth = rawDate.format(FORMAT_DATE);
            const lastMonth = rawDate.subtract(1, "months").format(FORMAT_DATE);
            const threeMonth = rawDate.subtract(1, "months").startOf("month").format(FORMAT_DATE);

            const sort = orderby.split(" ")[0];
            const asc = orderby.split(" ")[1] === "asc";
            // FIXME
            const differentDuration = customDurationList.includes(table);
            const to = differentDuration ? currentMonth : lastMonth;
            const from = differentDuration ? currentMonth : threeMonth;

            return {
                country,
                keys: "$" + category,
                includeSubdomains: true,
                to,
                from,
                sort,
                asc,
                timeGranularity: "Monthly",
                sortedColumn: "Domain",
                sortDirection: "asc",
                category,
                webSource,
                isWindow: false,
                table,
                searchTypeParam,
                orderby,
            };
        },
        getExcelUrl(params: any, domains: number | string[]): string {
            const dataParams = dataParamsAdapter(params);
            if (!Array.isArray(domains)) {
                dataParams["top"] = domains;
            }
            return `${tableMetaData.excelApi}?${queryString.stringify(dataParams)}`;
        },
        getAccountParams(params: any, domains: number | string[]) {
            const dataParams = dataParamsAdapter(params);
            if (!Array.isArray(domains)) {
                dataParams["pageSize"] = domains;
            }
            return dataParams;
        },
    };
};
