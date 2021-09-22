import { Button } from "@similarweb/ui-components/dist/button";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import angular from "angular";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import * as qs from "query-string";
import * as _ from "lodash";
import React, { useState } from "react";
import styled from "styled-components";
import { ExcelButton } from "../../../../../components/React/ExcelButton/ExcelButton";
import SWReactTableWrapper from "../../../../../components/React/Table/SWReactTableWrapper";
import { getColumns } from "./getColumns";
import SWReactRootComponent from "../../../../../decorators/SWReactRootComponent";
import { isSalesIntelligenceAppsState } from "pages/sales-intelligence/helpers/helpers";

export interface IAffinityGridProps {
    appId: string;
    appName: string;
}

export interface IAffinityTableRecord {
    Affinity: number;
    AppID: string;
    CategoryRank: number;
    CountryRank: number;
    Icon: string;
    MainCategoryID: string;
    Publisher: string;
    Title: string;
    Tooltip?: {
        AppStore: string;
        Author: string;
        Category: string;
        Icon: string;
        Price: string;
        Title: string;
    };
}

export interface IAffinityTable {
    FilteredCount?: number;
    PageNumber?: number;
    PageSize?: number;
    TotalCount?: number;
    Records?: IAffinityTableRecord[];
}

export interface IAffinityCategory {
    children: IAffinityCategory[];
    count: number;
    id: string;
    text: string;
}

export interface IAffinityCategoryDistributionApp {
    AppId: string;
    AppStore: string;
    Author: string;
    Category: string;
    Icon: string;
    Price: string;
    Title: string;
}

export interface IAffinityCategoryDistribution {
    Affinity: number;
    Apps: IAffinityCategoryDistributionApp[];
    Category: string;
}

export interface IAffinityData {
    [appId: string]: {
        Table: IAffinityTable;
        Categories: IAffinityCategory[];
        CategoryDistribution: IAffinityCategoryDistribution[];
    };
}

export interface IAppAffinityTableTopBarProps {
    onFilterChange: (filters: any, shouldReloadPage: boolean) => void;
    search: string;
    excelUrl: string;
}

export const AffinityTableTopBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    padding: 16px 16px 0;
`;
AffinityTableTopBar.displayName = "AffinityTableTopBar";

export const AffinityTableTopBarLeftSide = styled.div`
    display: flex;
`;
AffinityTableTopBarLeftSide.displayName = "AffinityTableTopBarLeftSide";

export const ResetButtonWrapper = styled.div`
    margin-left: 24px;
`;
ResetButtonWrapper.displayName = "ResetButtonWrapper";

export const AppAffinityTableTopBar = (props: IAppAffinityTableTopBarProps) => {
    const onSearch = (value) => {
        props.onFilterChange({ filter: JSON.stringify({ Title: value }) }, true);
    };
    const onReset = () => {
        const swNavigator = Injector.get("swNavigator") as any;

        swNavigator.updateQueryParams({ page: undefined, filter: null });
    };

    return (
        <AffinityTableTopBar>
            <AffinityTableTopBarLeftSide>
                <SearchInput
                    defaultValue={props.search}
                    debounce={400}
                    onChange={onSearch}
                    placeholder={i18nFilter()("forms.search.placeholder")}
                />
                <ResetButtonWrapper>
                    <Button type="flat" onClick={onReset}>
                        Reset
                    </Button>
                </ResetButtonWrapper>
            </AffinityTableTopBarLeftSide>
            <ExcelButton url={props.excelUrl} trackName="GetAudienceInterestsTsv" />
        </AffinityTableTopBar>
    );
};

const AppAffinityTable = (props: IAffinityGridProps) => {
    const swNavigator = Injector.get("swNavigator") as any;
    const apiParams = swNavigator.getApiParams();
    const pageParams = swNavigator.getParams();
    const orderBy = pageParams.orderby && pageParams.orderby.split(" ");
    const sortedColumn = orderBy
        ? { field: orderBy[0], sortDirection: orderBy[1] }
        : { field: "Affinity", sortDirection: "desc" };
    const excelUrl = `/export/AppEngagement/GetAudienceInterestsTsv?${qs.stringify(apiParams)}`;
    const serverApi = "/api/AppEngagement/GetAudienceInterests";
    const extractData = (data: IAffinityData): IAffinityTable => {
        const { country, duration } = swNavigator.getParams();
        const tableData: IAffinityTable = _.get(data, [props.appId, "Table"], {});

        const state = isSalesIntelligenceAppsState(swNavigator)
            ? "salesIntelligence-apps-performance"
            : "apps-performance";

        if (tableData.Records) {
            tableData.Records = tableData.Records.map((appItem) => {
                return {
                    ...appItem,
                    url: swNavigator.href(state, {
                        appId: `0_${appItem.AppID}`,
                        country,
                        duration,
                    }),
                };
            });
        }

        return tableData;
    };
    const onSort = ({ field, sortDirection }) => {
        swNavigator.updateQueryParams({
            page: undefined,
            filter: pageParams.filter,
            orderby: `${field} ${sortDirection}`,
        });
    };
    let pageFilters;
    try {
        pageFilters = JSON.parse(pageParams.filter);
    } catch (error) {
        pageFilters = {};
    }
    const searchString = pageFilters.Title || "";
    const i18nReplacements = { appName: props.appName };
    const tableColumns = getColumns(sortedColumn, i18nReplacements);
    return (
        <SWReactTableWrapper
            serverApi={serverApi}
            initialFilters={apiParams}
            transformData={extractData}
            tableColumns={tableColumns}
            tableOptions={{ metric: "AppAffinityDataTable" }}
            recordsField="Records"
            totalRecordsField="FilteredCount"
            onSort={onSort}
            pageIndent={1}
            rowsPerPage={100}
        >
            {(topComponentProps) => (
                <AppAffinityTableTopBar
                    {...topComponentProps}
                    excelUrl={excelUrl}
                    search={searchString}
                />
            )}
        </SWReactTableWrapper>
    );
};

export default SWReactRootComponent(AppAffinityTable, "AppAffinityTable");
