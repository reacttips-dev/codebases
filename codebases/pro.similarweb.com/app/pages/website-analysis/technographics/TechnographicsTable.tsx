/* eslint-disable react/display-name */
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import _ from "lodash";
import { Pagination } from "@similarweb/ui-components/dist/pagination";
import { SWReactTable } from "components/React/Table/SWReactTable";
import { sortSettings, TECHNOGRAPHICS_PAGE_TABLE } from "./constants";
import { ISortableFields, sortDirection, sortSettingsType } from "./types";
import { getTableColumns } from "./utils";
import { TableContainer, PaginationWrapper } from "./styles";

type TechnographicsTableProps = {
    keys: string[];
    rawData: unknown;
    isLoading: boolean;
    searchString: string;
    selectedCategory: string;
    getSiteImage?(site: string): string;
    selectedSubdomains: string[];
    columnsConfig?: Record<string, unknown>[];
    pageSize?: number;
    selectedSubCategory?: string;
    lengthToShowPagination?: number;
    dataChangeCallback?(data: unknown): unknown[];
};

export function TechnographicsTable({
    keys,
    rawData,
    isLoading,
    searchString,
    selectedCategory,
    getSiteImage,
    selectedSubdomains,
    columnsConfig,
    pageSize,
    selectedSubCategory,
    lengthToShowPagination,
    dataChangeCallback = _.identity,
}: TechnographicsTableProps): JSX.Element {
    const [order, setOrder] = useState(sortSettings);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = pageSize || 100;
    const onPageChange = useCallback((newPage) => setCurrentPage(newPage - 1), []);

    function onSortClickSort(
        column: { field: keyof ISortableFields },
        sortDirection: sortDirection,
        tableData,
    ) {
        const { [column.field]: primarySortField, ...otherSortFields } = sortSettings;
        setOrder({
            [column.field]: sortDirection,
            ...otherSortFields,
        } as sortSettingsType);
    }
    function filterData() {
        function filterByCategory(data) {
            if (selectedCategory && selectedCategory !== null) {
                return data.filter(({ category }) => category === selectedCategory);
            }
            if (selectedSubCategory && selectedSubCategory !== null) {
                return data.filter(({ subCategory }) => subCategory === selectedSubCategory);
            }
            return data;
        }

        function filterBySubDomain(data) {
            const subDomainNames = selectedSubdomains.map(Object.keys).flat();
            if (subDomainNames.length) {
                return data.filter((item) => {
                    return item?.usedBy.reduce((acc, item) => {
                        if (subDomainNames.includes(item)) {
                            acc = true;
                        }
                        return acc;
                    }, false);
                });
            }
            return data;
        }

        function filterBySearchTerm(data) {
            if (searchString && searchString.trim()) {
                return data.filter((item) =>
                    Object.values(item)
                        .filter((val) => !_.isNil(val))
                        .some((val) =>
                            val
                                .toString()
                                .trim()
                                .toLowerCase()
                                .includes(searchString.trim().toLowerCase()),
                        ),
                );
            }
            return data;
        }

        return _.flowRight(
            dataChangeCallback,
            filterBySearchTerm,
            filterByCategory,
            filterBySubDomain,
        )(rawData);
    }

    function sortData(filteredData) {
        return _.orderBy(
            filteredData,
            Object.keys(order).map((field) => (record) =>
                _.isNil(record[field]) ? "zzzzz" : record[field].toLowerCase().trim(),
            ),
            Object.values(order),
        );
    }

    const filteredData = useMemo(() => filterData(), [
        rawData,
        searchString,
        selectedCategory,
        selectedSubCategory,
        selectedSubdomains,
    ]);

    const sortedData = useMemo(() => sortData(filteredData), [filteredData, order]);

    useLayoutEffect(() => {
        setCurrentPage(0);
    }, [sortedData]);

    const finalData = useMemo(() => {
        const nextPageIndex = currentPage * itemsPerPage;
        const nextChunk = sortedData.slice(nextPageIndex, nextPageIndex + itemsPerPage);
        return { Records: nextChunk, TotalCount: sortedData.length };
    }, [sortedData, currentPage]);

    const tableOptions = useMemo(
        () => ({
            onSort: onSortClickSort,
            metric: TECHNOGRAPHICS_PAGE_TABLE,
        }),
        [],
    );
    const tableColumn = useMemo(() => getTableColumns(keys, order, getSiteImage), [keys, order]);

    const showPagination = lengthToShowPagination
        ? lengthToShowPagination <= sortedData.length
        : !!sortedData.length;

    const itemsCount = sortedData.length;

    return (
        <TableContainer>
            <SWReactTable
                tableData={finalData}
                tableColumns={columnsConfig || tableColumn}
                tableOptions={tableOptions}
                isLoading={isLoading}
            />
            <div>
                {showPagination && (
                    <PaginationWrapper>
                        <Pagination
                            page={currentPage + 1}
                            itemsPerPage={itemsPerPage}
                            itemsCount={itemsCount}
                            handlePageChange={onPageChange}
                            captionPosition="center"
                            hasItemsPerPageSelect={false}
                        />
                    </PaginationWrapper>
                )}
            </div>
        </TableContainer>
    );
}
