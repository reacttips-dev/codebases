import React, { useEffect, useState, memo } from 'react';
import { StylesProvider, useMultiStyleConfig, Text, HStack, VStack, Box, } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';
import { useTable, usePagination, useRowSelect } from 'react-table';
import { FixedSizeList } from 'react-window';
import { useDeepMemo } from '../hooks';
import { SkeletonProvider } from '../Skeleton';
import { TableHeader, TableRow, ColumnsFilter } from './components/index';
const staticProps = {
    infiniteScrollContainer: {
        style: { marginTop: 0 },
    },
};
export const _Table = ({ bodyProps, columns, data, getRowProps, getTableProps: customTableProps, hasMore, headerProps, itemSize = 77, loading, onSelectItems, recordSize, showColumnsFilter = true, showHeaders = true, total, }) => {
    const styles = useMultiStyleConfig('Table', {});
    const [mounted, setMounted] = useState(false);
    const tableData = useDeepMemo(() => data.filter(it => it !== null) || [], [
        data,
    ]);
    const tableColumns = useDeepMemo(() => {
        return columns.map(({ title, accessor, id, customCell: Cell, isFilterable, ...rest }) => ({
            isFilterable,
            [accessor ? 'accessor' : 'id']: accessor || id,
            Header: title || (() => null),
            Cell: ({ row }) => {
                if (Cell) {
                    return React.createElement(Cell, Object.assign({}, row));
                }
                return React.createElement(Text, null, row.values[accessor]);
            },
            ...rest,
        }));
    }, [columns]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state: { hiddenColumns, selectedRowIds }, allColumns, } = useTable({
        columns: tableColumns,
        data: tableData,
        initialState: {
            pageIndex: 0,
            pageSize: recordSize || 20,
            hiddenColumns: [],
        },
        manualPagination: true,
        pageCount: total,
    }, usePagination, useRowSelect);
    // React-table doesn't have a callback for state
    // updates, so we track it manually to see if
    // the selected rows list has changed
    useEffect(() => {
        if (!mounted)
            return setMounted(true);
        const isTableSelectable = typeof onSelectItems === 'function';
        if (isTableSelectable) {
            onSelectItems(selectedRowIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onSelectItems, selectedRowIds]);
    return (React.createElement(SkeletonProvider, { loading: loading },
        React.createElement(StylesProvider, { value: styles },
            showColumnsFilter && (React.createElement(HStack, { justify: "flex-end" },
                React.createElement(ColumnsFilter, { columns: allColumns, hiddenColumns: hiddenColumns }))),
            React.createElement(Box, Object.assign({}, staticProps.infiniteScrollContainer),
                React.createElement(VStack, Object.assign({ spacing: 0 }, getTableProps(), customTableProps === null || customTableProps === void 0 ? void 0 : customTableProps()),
                    showHeaders && (React.createElement(TableHeader, { headerProps: headerProps, headerGroups: headerGroups })),
                    React.createElement(VStack, Object.assign({ "data-testid": "table-body", width: "full", spacing: 0 }, getTableBodyProps(), bodyProps), hasMore ? (React.createElement(FixedSizeList, { height: (rows === null || rows === void 0 ? void 0 : rows.length) * itemSize, itemCount: rows === null || rows === void 0 ? void 0 : rows.length, itemSize: itemSize, width: "100%" }, ({ index }) => {
                        const row = rows[index];
                        prepareRow(row);
                        return (React.createElement(TableRow, { itemSize: itemSize, key: row.id, row: row, index: index, getRowProps: getRowProps, showHeaders: showHeaders }));
                    })) : (React.createElement(React.Fragment, null, rows.map((row, index) => {
                        prepareRow(row);
                        return (React.createElement(TableRow, { key: row.id, row: row, index: index, getRowProps: getRowProps, showHeaders: showHeaders }));
                    })))))))));
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Table = memo(_Table, isEqual);
//# sourceMappingURL=Table.js.map