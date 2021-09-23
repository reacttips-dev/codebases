import React, { useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import { getValidChildren } from '@chakra-ui/react-utils';
import { runIfFn } from '@chakra-ui/utils';
import { Trans, useTranslation } from 'tribe-translation';
import { Button } from '../Button';
import { TableLoading, TableStack } from './components';
import { Table } from './Table';
import { TableEmptyState, TableSearchEmptyState, TableSearchHeader, } from './TableSearchHeader';
export const TableColumnWrapper = ({ children, }) => React.createElement(React.Fragment, null, children);
export const TableWrapper = ({ children, columns, data, dataTestId, emptySearchResultComponent, emptyStateComponent, fetchMore, hasMore, hasTab = false, itemSize, loading, onSearch, searchPlaceholder, searchResult = false, showColumnsFilter = false, showFetchMoreButton = true, showHeaders = true, skeletonRowCount = 3, total, }) => {
    const { t } = useTranslation();
    const isSearchable = typeof onSearch === 'function';
    const handleSearch = useCallback((query) => {
        if (onSearch) {
            onSearch({ query });
        }
    }, [onSearch]);
    let computedColumns = columns;
    if (!computedColumns) {
        const validChildren = getValidChildren(children);
        computedColumns = validChildren.map(child => {
            const { children, ...rest } = (child === null || child === void 0 ? void 0 : child.props) || {};
            return {
                ...rest,
                customCell: ({ original }) => runIfFn(children, original),
            };
        });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(TableStack, { "data-testid": dataTestId, borderTopRadius: hasTab && 'none' },
            isSearchable && (React.createElement(TableSearchHeader, { onSearch: handleSearch, placeholder: searchPlaceholder || t('common:search.placeholder', 'Search...') })),
            loading && (data === null || data === void 0 ? void 0 : data.length) === 0 && (React.createElement(Table, { columns: computedColumns, data: new Array(skeletonRowCount).fill({}), hasMore: false, itemSize: itemSize, loading: true, showColumnsFilter: showColumnsFilter, showHeaders: showHeaders, total: skeletonRowCount })),
            !loading && (data === null || data === void 0 ? void 0 : data.length) === 0 && (React.createElement(Box, { py: 10 }, !searchResult
                ? emptyStateComponent || React.createElement(TableEmptyState, null)
                : emptySearchResultComponent || React.createElement(TableSearchEmptyState, null))),
            (data === null || data === void 0 ? void 0 : data.length) > 0 && (React.createElement(Table, { columns: computedColumns, data: data, fetchData: fetchMore, hasMore: hasMore, itemSize: itemSize, loading: loading, showColumnsFilter: showColumnsFilter, showHeaders: showHeaders, total: total || 0 })),
            showFetchMoreButton && hasMore && (data === null || data === void 0 ? void 0 : data.length) > 0 && fetchMore && (React.createElement(Box, { flexGrow: 1, p: 6 },
                React.createElement(Button, { onClick: fetchMore, w: "full", buttonType: "secondary" },
                    React.createElement(Trans, { key: "member:list.load_more", defaults: "Load more" }))))),
        loading && hasMore && (data === null || data === void 0 ? void 0 : data.length) > 0 && React.createElement(TableLoading, null)));
};
//# sourceMappingURL=TableWrapper.js.map