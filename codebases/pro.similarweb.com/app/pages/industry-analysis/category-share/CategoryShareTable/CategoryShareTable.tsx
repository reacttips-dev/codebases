import React, { FC, useMemo, useRef, useState } from "react";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import {
    getTableColumnsConfig,
    getTableFilters,
    getUrlForTableRow,
} from "pages/industry-analysis/category-share/CategoryShareTable/CategoryShareTableConfig";
import { ICategoryShareServices } from "pages/industry-analysis/category-share/CategoryShareTypes";
import { connect } from "react-redux";
import ColorStack from "components/colorsStack/ColorStack";
import { CHART_COLORS } from "constants/ChartColors";
import { tableActionsCreator } from "actions/tableActions";
import { useTableColors } from "pages/industry-analysis/category-share/CategoryShareTable/useTableColors";
import { CategoryShareTableTop } from "pages/industry-analysis/category-share/CategoryShareTable/CategoryShareTableTop/CategoryShareTableTop";
import {
    ICategoryShareTableProps,
    ITableColumnSort,
} from "pages/industry-analysis/category-share/CategoryShareTable/CategoryShareTableTypes";
import { getCategoryShareParams } from "../CategoryShareUtils";
import { CategoryShareTableContainer } from "pages/industry-analysis/category-share/CategoryShareTable/CategoryShareTableStyles";

const noDataTitleKey = "global.nodata.notavilable";
const noDataSubTitleKey = "global.nodata.notavilable.subtitle";
const tableAPI = "/widgetApi/CategoryShare/CategoryShareIndex/Table";

const CategoryShareTable: FC<ICategoryShareTableProps> = (props) => {
    const {
        services,
        params,
        tableSelectionKey,
        initialSelectedRowsCount = 10,
        maxSelectedRowsCount = 10,
        clearAllSelectedRows,
        selectRows,
    } = props;

    const [sort, setSort] = useState<ITableColumnSort>({
        field: "Share",
        sortDirection: "desc",
    });

    const { initializeTableRowsWithColor, handleRowSelectionWithColor } = useTableColors();
    const tableFilters = useMemo(() => getCategoryShareParams(params, "Monthly", services), [
        params,
        services,
    ]);
    const tableColumns = getTableColumnsConfig(sort);

    const transformData = (data) => {
        return {
            itemsCount: data.TotalCount,
            records: data.Data.map((row) => {
                return {
                    ...row,
                    url: getUrlForTableRow(row, params),
                };
            }),
        };
    };

    const onGetData = (data: { records: any[] }) => {
        clearAllSelectedRows();
        const rowsWithColor = initializeTableRowsWithColor(data.records, initialSelectedRowsCount);
        selectRows(rowsWithColor);
    };

    const onSort = (sortDetails: ITableColumnSort) => {
        setSort(sortDetails);
    };

    return (
        <CategoryShareTableContainer>
            <SWReactTableWrapperWithSelection
                tableSelectionKey={tableSelectionKey}
                tableSelectionProperty="Domain"
                serverApi={tableAPI}
                tableColumns={tableColumns}
                transformData={transformData}
                getDataCallback={onGetData}
                onBeforeRowSelectionToggle={handleRowSelectionWithColor}
                onSort={onSort}
                tableOptions={{
                    longLoader: true,
                    noDataTitle: services.translate(noDataTitleKey),
                    noDataSubtitle: services.translate(noDataSubTitleKey),
                    tableSelectionTrackingParam: "domain",
                    showCompanySidebar: true,
                }}
                paginationProps={{
                    showPagination: false,
                }}
                initialFilters={tableFilters}
                totalRecordsField="itemsCount"
                recordsField="records"
                cleanOnUnMount={true}
                deleteTableSelectionOnUnMount={true}
                pageIndent={1}
                maxSelectedRows={maxSelectedRowsCount}
            >
                {(topComponentProps) => (
                    <CategoryShareTableTop
                        {...topComponentProps}
                        services={services}
                        tableApiQueryParams={tableFilters}
                    />
                )}
            </SWReactTableWrapperWithSelection>
        </CategoryShareTableContainer>
    );
};

const mapStateToProps = (state, ownProps) => {
    const {
        routing: { params },
        tableSelection,
    } = state;
    return {
        params,
        selectedRows: tableSelection[ownProps.tableSelectionKey],
    };
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

const connected = connect(mapStateToProps, mapDispatchToProps)(CategoryShareTable);
export default connected;
