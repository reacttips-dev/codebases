import * as React from "react";
import { useState } from "react";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import * as _ from "lodash";
import { i18nFilter } from "../../../filters/ngFilters";
import { TableWrapper } from "../../conversion/conversionTableContainer/StyledComponents";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ExcelButton } from "components/React/ExcelButton/ExcelButton";
import { SWReactTable } from "components/React/Table/SWReactTable";
import { SubdomainsTableColumnsConfigGen } from "pages/website-analysis/subdomains/SubdomainsTableColumnConfig";
import {
    ButtonContainer,
    TableTopContainer,
} from "pages/website-analysis/subdomains/StyledComponents";

export interface ISubdomainsTableProps {
    tableData: any;
    isLoading?: boolean;
    tableExcelUrl?: string;
    isCompare?: boolean;
}

export const SubdomainsTable = (props: ISubdomainsTableProps) => {
    const [searchString, setSearchString] = useState("");
    const [sortedColumn, setSortedColumn] = useState<{
        field: string;
        sortDirection: "desc" | "asc";
    }>({
        field: "Share",
        sortDirection: "desc",
    });

    const isEmptyData = !(props.tableData?.TotalCount > 0);

    const onSearch = React.useCallback((val: string) => {
        setSearchString(val.trim().toLowerCase());
    }, []);

    const onSort = React.useCallback(({ field, sortDirection }) => {
        setSortedColumn({
            field,
            sortDirection,
        });
    }, []);

    const { isLoading, tableExcelUrl, tableData } = props;

    const filteredData = React.useMemo(() => {
        let filteredData = [];
        if (!isLoading && tableData) {
            const { Data } = tableData;
            filteredData =
                !isLoading && searchString !== ""
                    ? _.filter(Data, (dataItem: any) => {
                          return dataItem.Domain.toLowerCase().indexOf(searchString) !== -1;
                      })
                    : Data;
        }
        return filteredData;
    }, [isLoading, tableData, searchString]);

    const sortedFilteredData = React.useMemo(() => {
        function orderByWithNullsAtEnd(
            collection: any[],
            field: string,
            sortDirection: "desc" | "asc",
        ) {
            const partition = _.partition(collection, (x) => !!_.get(x, field, null));

            return _.concat(
                _.orderBy(partition[0], field === "Domain" ? "Domain" : field, sortDirection),
                partition[1],
            );
        }

        return orderByWithNullsAtEnd(filteredData, sortedColumn.field, sortedColumn.sortDirection);
    }, [filteredData, sortedColumn.field, sortedColumn.sortDirection]);

    const tableColumns = React.useMemo(() => {
        const { tableData } = props;
        if (!tableData) {
            return [];
        }

        const columns = SubdomainsTableColumnsConfigGen(
            sortedColumn.field,
            sortedColumn.sortDirection,
            props.isCompare,
        );

        const totalCount = props.tableData?.TotalCount;
        const domainDisplayName = columns[1]?.displayName;
        if (totalCount && domainDisplayName && domainDisplayName === "Domain") {
            columns[1].displayName = domainDisplayName + ` (${totalCount})`; // added "total count" to domain column title
        }
        return columns;
    }, [props.isCompare, sortedColumn.field, sortedColumn.sortDirection, props.tableData]);

    const sortedFilteredTableData = React.useMemo(() => {
        return { Data: sortedFilteredData, TotalCount: sortedFilteredData?.length };
    }, [sortedFilteredData, sortedFilteredData]);

    return (
        <TableWrapper loading={isLoading}>
            {!isEmptyData && (
                <TableTopContainer>
                    <SearchInput
                        defaultValue={searchString}
                        debounce={100}
                        onChange={onSearch}
                        placeholder={i18nFilter()(
                            "website.analysis.subdomains.table.search.placeholder",
                        )}
                        disableClear={true}
                    />
                    {tableExcelUrl && (
                        <PlainTooltip tooltipContent={i18nFilter()("downloadCSV")}>
                            <ButtonContainer>
                                <ExcelButton
                                    url={tableExcelUrl}
                                    trackName="website analysis subdomains"
                                    className={"excel-button-wrapper"}
                                />
                            </ButtonContainer>
                        </PlainTooltip>
                    )}
                </TableTopContainer>
            )}
            <SWReactTable
                onSort={onSort}
                tableColumns={tableColumns}
                isLoading={isLoading}
                tableData={sortedFilteredTableData}
            />
        </TableWrapper>
    );
};
