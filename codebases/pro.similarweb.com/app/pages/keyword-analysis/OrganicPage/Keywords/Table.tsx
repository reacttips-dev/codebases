import { Injector } from "common/ioc/Injector";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import { TableTop } from "./TableTop";
import React, { useMemo, useState } from "react";
import getTableColumns from "./TableColumns";
import { apiHelper } from "common/services/apiHelper";

const Table: React.FC<any> = (props) => {
    const [dataFilters, setDataFilters] = useState<{
        Source?: any[];
        Type?: any[];
        Category?: any[];
    }>({});

    const [sort, setSort] = useState<{ field; sortDirection }>();

    const transformData = (data) => {
        return {
            ...data,
            records: data.Data.map((record) => {
                return {
                    ...record,
                };
            }),
        };
    };

    const initialFilters = useMemo(() => {
        const params = {
            ...props.params,
            keys: props.params.keyword,
            webSource: props.params.webSource,
            timeGranularity: "Monthly",
            includeSubDomains: true,
        };
        delete params.keyword;
        const apiParams = apiHelper.transformParamsForAPI(params);
        apiParams.orderBy = "Share desc";
        return apiParams;
    }, [props.params]);
    const onSort = ({ field, sortDirection }) => {
        setSort({ field, sortDirection });
    };
    const tableColumns = useMemo(() => {
        return getTableColumns(sort, props.excludeFields);
    }, [sort]);
    return (
        <div className="keywords-table">
            <SWReactTableWrapper
                preventCountTracking={props.preventCountTracking}
                transformData={transformData}
                serverApi={props.tableApiEndpoint}
                initialFilters={initialFilters}
                tableColumns={tableColumns}
                tableOptions={{
                    tableSelectionTrackingParam: "Keyword",
                    trackName: "Traffic Sources",
                }}
                recordsField="records"
                totalRecordsField="TotalCount"
                onSort={onSort}
                pageIndent={1}
            >
                {(topComponentProps) => (
                    <TableTop
                        {...topComponentProps}
                        families={dataFilters.Source}
                        sources={dataFilters.Type}
                        categories={dataFilters.Category}
                        addToDashboardMetric={props.addToDashboardMetric}
                        addToDashboardWebsource={props.addToDashboardWebsource}
                        excelMetric={props.excelMetric}
                    />
                )}
            </SWReactTableWrapper>
        </div>
    );
};

export default Table;
