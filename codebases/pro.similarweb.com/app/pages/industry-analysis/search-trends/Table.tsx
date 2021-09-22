import SWReactRootComponent from "decorators/SWReactRootComponent";
import { connect } from "react-redux";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { i18nFilter } from "filters/ngFilters";
import React, { useState } from "react";
import { tableActionsCreator } from "actions/tableActions";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { DesktopMobileShare, getColumns } from "pages/industry-analysis/search-trends/getColumns";
import { getInitialFilters } from "pages/industry-analysis/search-trends/getInitialFilters";
import { transformData } from "pages/industry-analysis/search-trends/transformData";
import { TableTop } from "pages/industry-analysis/search-trends/TableTop";
import AddTableRowsKeywordsToGroupUtility from "pages/keyword-analysis/AddTableRowsKeywordsToGroupUtility";

export const TABLE_SELECTION_KEY = "INDUSTRY_TRENDS_TABLE";
const TABLE_SELECTION_PROPERTY = "SearchTerm";
const TABLE_ENDPOINT = "/widgetApi/IndustryAnalysisTopKeywords/SearchKeywordsAbb/Table";

export const Table = ({ params }) => {
    const { webSource } = params;
    const [sort, setSort] = useState<{ field: string; sortDirection: "desc" | "asc" }>({
        field: "TotalShare",
        sortDirection: "desc",
    });

    const onSort = ({ field, sortDirection }) => {
        setSort({ field, sortDirection });
    };

    const columns = React.useMemo(() => {
        const excludeFields = [webSource !== devicesTypes.TOTAL && DesktopMobileShare];
        const columns = getColumns(excludeFields, sort);
        return columns;
    }, [sort, webSource]);

    const initialFilters = getInitialFilters(params, sort);
    const i18n = i18nFilter();
    return (
        <>
            <SWReactTableWrapperWithSelection
                tableSelectionKey={TABLE_SELECTION_KEY}
                tableSelectionProperty={TABLE_SELECTION_PROPERTY}
                initialFilters={initialFilters}
                transformData={transformData}
                onSort={onSort}
                serverApi={TABLE_ENDPOINT}
                tableColumns={columns}
                tableOptions={{
                    noDataTitle: i18n("industry.leaders.table.no.data.title"),
                    noDataSubtitle: i18n("industry.leaders.table.no.data.subtitle"),
                    tableSelectionTrackingParam: "keyword",
                    showCompanySidebar: true,
                    aboveHeaderComponents: [
                        <AddTableRowsKeywordsToGroupUtility
                            key="1"
                            clearAllSelectedRows={
                                tableActionsCreator(TABLE_SELECTION_KEY, TABLE_SELECTION_PROPERTY)
                                    .clearAllSelectedRows
                            }
                            stateKey={TABLE_SELECTION_KEY}
                        />,
                    ],
                    metric: "NewSearchKeywords_Table",
                }}
                recordsField="records"
                totalRecordsField="TotalCount"
                pageIndent={1}
                cleanOnUnMount={true}
                rowsPerPage={100}
            >
                {(topComponentProps) => (
                    <TableTop
                        {...topComponentProps}
                        initialFilters={initialFilters}
                        params={params}
                    />
                )}
            </SWReactTableWrapperWithSelection>
        </>
    );
};

const mapStateToProps = (state) => {
    const { tableSelection, routing } = state;
    const { params } = routing;
    return {
        params,
        tableSelection,
    };
};

const mapDispatchToProps = (dispatch) => {
    const tableAction = tableActionsCreator(TABLE_SELECTION_KEY, TABLE_SELECTION_PROPERTY);
    return {
        selectRows: (rows) => {
            dispatch(tableAction.clearAllSelectedRows());
            dispatch(tableAction.selectRows(rows));
        },
    };
};

export const SearchTrendsTable = connect(mapStateToProps, mapDispatchToProps)(Table);
SWReactRootComponent(SearchTrendsTable, "SearchTrendsTable");
