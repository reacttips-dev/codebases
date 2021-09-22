import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import autobind from "autobind-decorator";
import { ExcelButton } from "components/React/ExcelButton/ExcelButton";
import * as _ from "lodash";
import { CategoryLoyaltyTableColumnsConfigGen } from "pages/industry-analysis/category-loyalty/CategoryLoyaltyTableConfig";
import {
    StyledSearchContainer,
    StyledTableWrapper,
} from "pages/industry-analysis/category-loyalty/StyledComponents";
import { TableTopContainer } from "pages/industry-analysis/geography/IndustryAnalysisGeographyTableContainer";
import { ExcelButtonContainer } from "pages/segments/components/benchmarkOvertime/StyledComponents";
import React, { Component, useMemo, useState } from "react";
import { SWReactTable } from "../../../components/React/Table/SWReactTable";
import { i18nFilter } from "../../../filters/ngFilters";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";

export interface ICategoryLoyaltyTableContainerProps {
    tableData: any;
    isLoading?: boolean;
    generateTableExcelApiUrl: string;
}

export interface ISortColumn {
    field: string;
    sortDirection: "desc" | "asc";
    customSort?: (a, b) => number;
}

export const CategoryLoyaltyTableContainer = (props: ICategoryLoyaltyTableContainerProps) => {
    const [searchString, setSearchString] = useState<string>("");
    const [sortedColumn, setSortedColumn] = useState<ISortColumn>({
        field: "Share",
        sortDirection: "desc",
        customSort: undefined,
    });

    const onSearch = (val) => {
        setSearchString(val.trim());
    };

    const onSort = ({ field, sortDirection }, undefined, column) => {
        setSortedColumn({
            field,
            sortDirection,
            customSort: column.customSort,
        });
    };

    const tableColumns = useMemo<any>(() => {
        return CategoryLoyaltyTableColumnsConfigGen(sortedColumn.field, sortedColumn.sortDirection);
    }, [sortedColumn]);

    const render = () => {
        const { isLoading, tableData, generateTableExcelApiUrl } = props;
        let filteredData = [];
        if (!isLoading && tableData) {
            filteredData =
                !isLoading && searchString !== ""
                    ? _.filter(tableData, (dataItem: any) => {
                          return (
                              dataItem.Domain.toLowerCase().indexOf(searchString.toLowerCase()) !==
                              -1
                          );
                      })
                    : tableData;
            filteredData = sortedColumn.customSort
                ? sortedColumn.sortDirection === "asc"
                    ? filteredData.sort(sortedColumn.customSort)
                    : filteredData.sort(sortedColumn.customSort).reverse()
                : _.orderBy(filteredData, sortedColumn.field, sortedColumn.sortDirection);
        }

        const tableProps = {
            onSort,
            isLoading,
            tableData: { Data: filteredData, TotalCount: tableData?.length },
            tableColumns: tableColumns,
            addPaddingRightCell: true,
        };

        return (
            <StyledTableWrapper loading={isLoading}>
                <TableTopContainer>
                    <StyledSearchContainer>
                        <SearchInput
                            defaultValue={searchString}
                            debounce={100}
                            onChange={onSearch}
                            placeholder={i18nFilter()(
                                "category.analysis.loyalty.table.search.placeholder",
                            )}
                        />
                    </StyledSearchContainer>

                    <PlainTooltip tooltipContent={i18nFilter()("downloadCSV")}>
                        <ExcelButtonContainer>
                            <ExcelButton
                                url={generateTableExcelApiUrl}
                                trackName="industry analysis loyalty"
                                className={"excel-button-wrapper"}
                            />
                        </ExcelButtonContainer>
                    </PlainTooltip>
                </TableTopContainer>
                <SWReactTable {...tableProps} />
            </StyledTableWrapper>
        );
    };

    return render();
};
