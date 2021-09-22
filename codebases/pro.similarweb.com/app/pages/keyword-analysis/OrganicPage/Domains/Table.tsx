import { tableActionsCreator } from "actions/tableActions";
import categoryService from "common/services/categoryService";
import ColorStack from "components/colorsStack/ColorStack";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { CHART_COLORS } from "constants/ChartColors";
import { TableTop } from "./TableTop";
import React, { useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import getTableColumns from "./TableColumns";
import { apiHelper } from "common/services/apiHelper";
import { isBundleUser } from "common/services/solutions2Helper";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

const Table: React.FC<any> = (props) => {
    const { excludeFields } = props;
    const [dataFilters, setDataFilters] = useState<{
        Source?: any[];
        Type?: any[];
        categories?: any[];
        customCategories?: any[];
    }>({});

    const [sort, setSort] = useState<{ field; sortDirection }>();
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const transformData = (data) => {
        const state = isBundleUser()
            ? "competitiveanalysis_website_search_keyword"
            : "competitiveanalysis_website_overview_websiteperformance";
        return {
            ...data,
            records: data.Data.map((record) => {
                return {
                    ...record,
                    selectable: record.Share > 0,
                    href: swNavigator.href(state, {
                        ...props.params,
                        key: record.Domain,
                        isWWW: "*",
                    }),
                };
            }),
        };
    };
    const colorStack = useRef(new ColorStack(CHART_COLORS.chartMainColors));
    const autoSelectRows = useRef<boolean>(true);
    const onBeforeRowSelectionToggle = (row) => {
        if (row.selected) {
            colorStack.current.release(row.selectionColor);
            return row;
        }
        return {
            ...row,
            selectionColor: row.selectionColor ? row.selectionColor : colorStack.current.acquire(),
        };
    };
    const getDataCallback = ({
        Filters = {
            Category: [],
            CustomCategory: [],
        },
        Data,
    }) => {
        const { Category: categories, CustomCategory: customCategories } = Filters;
        const filters = {
            ...Filters,
            ...categoryService.parseCategoriesFromApiToCategoriesFilter({
                categories,
                customCategories,
            }),
        };
        setDataFilters(filters);
        if (autoSelectRows.current) {
            colorStack.current.reset();
            props.clearAllSelectedRows();
            props.selectRows(
                Data.slice(0, props.initialSelectedRowsCount)
                    .filter((row) => row.Share > 0)
                    .map((row) => {
                        return {
                            ...row,
                            selectionColor: colorStack.current.acquire(),
                        };
                    }),
            );
        }
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
        apiParams.orderBy = "TotalShare desc";
        return apiParams;
    }, [props.params]);
    const onSort = ({ field, sortDirection }) => {
        setSort({ field, sortDirection });
    };
    const tableColumns = useMemo(() => {
        return getTableColumns(sort, props.columnsType, props.isKeywordsGroup, excludeFields);
    }, [sort]);
    return (
        <div className="domains-table">
            <SWReactTableWrapperWithSelection
                preventCountTracking={props.preventCountTracking}
                onBeforeRowSelectionToggle={onBeforeRowSelectionToggle}
                tableSelectionKey={props.tableSelectionKey}
                tableSelectionProperty="Domain"
                maxSelectedRows={props.initialSelectedRowsCount}
                cleanOnUnMount={true}
                deleteTableSelectionOnUnMount={true}
                transformData={transformData}
                serverApi={props.tableApiEndpoint}
                initialFilters={initialFilters}
                tableColumns={tableColumns}
                tableOptions={{
                    tableSelectionTrackingParam: "Domain",
                    trackName: "Traffic Sources",
                }}
                recordsField="records"
                totalRecordsField="TotalCount"
                onSort={onSort}
                pageIndent={1}
                getDataCallback={getDataCallback}
            >
                {(topComponentProps) => (
                    <TableTop
                        {...topComponentProps}
                        families={dataFilters.Source}
                        sources={dataFilters.Type}
                        categories={dataFilters.categories}
                        customCategories={dataFilters.customCategories}
                        addToDashboardMetric={props.addToDashboardMetric}
                        addToDashboardWebsource={props.params.webSource}
                        excelMetric={props.excelMetric}
                        tableTopFiltersSearchPlaceHolders={props.tableTopFiltersSearchPlaceHolders}
                    />
                )}
            </SWReactTableWrapperWithSelection>
        </div>
    );
};

Table.defaultProps = {
    initialSelectedRowsCount: 10,
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const tableAction = tableActionsCreator(ownProps.tableSelectionKey, "Domain");
    return {
        selectRows: (rows) => {
            dispatch(tableAction.selectRows(rows));
        },
        clearAllSelectedRows: () => {
            dispatch(tableAction.clearAllSelectedRows());
        },
    };
};

export default connect(null, mapDispatchToProps)(Table);
