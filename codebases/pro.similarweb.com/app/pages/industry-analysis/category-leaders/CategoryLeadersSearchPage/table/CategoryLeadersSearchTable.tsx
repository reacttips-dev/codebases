import React, { useState } from "react";
import {
    ICategoryLeadersNavParams,
    ICategoryLeadersServices,
    ITableColumnSort,
} from "pages/industry-analysis/category-leaders/CategoryLeaders.types";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import { categoryLeadersSearchTableAPI } from "./CategoryLeadersSearchTable.types";
import { getColumnsConfig } from "./CategoryLeadersSearchTableConfig";
import { getTableParams, getUrlForTableRecord } from "./CategoryLeadersSearchTableUtils";
import { CategoryLeadersSearchTableTop } from "./tableTop/CategoryLeadersSearchTableTop";

interface ICategoryLeadersSearchTableProps {
    navParams?: ICategoryLeadersNavParams;
    services: ICategoryLeadersServices;
}

const noDataTitleKey = "global.nodata.notavilable";
const noDataSubTitleKey = "global.nodata.notavilable.subtitle";

export const CategoryLeadersSearchTable: React.FunctionComponent<ICategoryLeadersSearchTableProps> = (
    props,
) => {
    const { services, navParams } = props;

    const [sort, setSort] = useState<ITableColumnSort>({
        field: "Share",
        sortDirection: "desc",
    });

    const tableColumns = getColumnsConfig(services.translate, sort);
    const tableFilters = getTableParams(navParams, sort, services);

    const transformData = (data) => {
        return {
            itemsCount: data.TotalCount,
            records: data.Data.map((row) => {
                return {
                    ...row,
                    url: getUrlForTableRecord(row, navParams, services),
                };
            }),
        };
    };

    const onSort = (sortDetails: ITableColumnSort) => {
        setSort(sortDetails);
    };

    return (
        <SWReactTableWrapper
            serverApi={categoryLeadersSearchTableAPI}
            tableColumns={tableColumns}
            initialFilters={tableFilters}
            transformData={transformData}
            paginationProps={{
                showPagination: true,
                hasItemsPerPageSelect: false,
            }}
            tableOptions={{
                noDataTitle: services.translate(noDataTitleKey),
                noDataSubtitle: services.translate(noDataSubTitleKey),
                showCompanySidebar: true,
            }}
            totalRecordsField="itemsCount"
            allowClientSort={true}
            recordsField="records"
            onSort={onSort}
            pageIndent={1}
            rowsPerPage={100}
        >
            {(topComponentProps) => (
                <CategoryLeadersSearchTableTop
                    {...topComponentProps}
                    services={services}
                    tableApiQueryParams={tableFilters}
                    navParams={navParams}
                    sort={sort}
                />
            )}
        </SWReactTableWrapper>
    );
};
