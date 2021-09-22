import * as React from "react";
import { useState } from "react";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import * as _ from "lodash";
import { countryTextByIdFilter, i18nFilter } from "../../../filters/ngFilters";
import { TableWrapper } from "../../conversion/conversionTableContainer/StyledComponents";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ExcelButton } from "components/React/ExcelButton/ExcelButton";
import { SWReactTable } from "components/React/Table/SWReactTable";
import { GeographyTableColumnsConfigGen } from "pages/website-analysis/geography/GeographyTableColumnConfig";
import {
    ButtonContainer,
    TableTopContainer,
} from "pages/website-analysis/geography/StyledComponents";

export interface IGeographyTableProps {
    tableData: any;
    isLoading?: boolean;
    tableExcelUrl?: string;
    isCompare?: boolean;
}

export const GeographyTable = (props: IGeographyTableProps) => {
    const [searchString, setSearchString] = useState("");
    const [sortedColumn, setSortedColumn] = useState<{
        field: string;
        sortDirection: "desc" | "asc";
    }>({
        field: "Share",
        sortDirection: "desc",
    });

    const onSearch = React.useMemo(
        () => (val: string) => {
            setSearchString(val.trim().toLowerCase());
        },
        [],
    );

    const onSort = React.useMemo(
        () => ({ field, sortDirection }) => {
            setSortedColumn({
                field,
                sortDirection,
            });
        },
        [],
    );

    const { isLoading, tableExcelUrl, tableData } = props;
    let filteredData = [];
    filteredData = React.useMemo(() => {
        if (!isLoading && tableData) {
            filteredData =
                !isLoading && searchString !== ""
                    ? _.filter(tableData.Data, (dataItem: any) => {
                          return (
                              countryTextByIdFilter()(dataItem.Country)
                                  .toLowerCase()
                                  .indexOf(searchString) !== -1
                          );
                      })
                    : tableData.Data;
            filteredData = orderByWithNullsAtEnd(
                filteredData,
                sortedColumn.field,
                sortedColumn.sortDirection,
            );
        }
        return filteredData;
    }, [isLoading, tableData, searchString, sortedColumn.field, sortedColumn.sortDirection]);

    function orderByWithNullsAtEnd(
        collection: any[],
        field: string,
        sortDirection: "desc" | "asc",
    ) {
        if (field === "Country") {
            collection = collection.map((item) => {
                return { ...item, CountryName: countryTextByIdFilter()(item.Country) };
            });
        }
        const partition = _.partition(collection, (x) => !!_.get(x, field, null));
        return _.concat(
            _.orderBy(partition[0], field === "Country" ? "CountryName" : field, sortDirection),
            partition[1],
        );
    }

    const tableColumns = React.useMemo(() => {
        return GeographyTableColumnsConfigGen(
            sortedColumn.field,
            sortedColumn.sortDirection,
            props.isCompare,
        );
    }, [props.isCompare, sortedColumn.field, sortedColumn.sortDirection]);

    const tableProps = React.useMemo(() => {
        return {
            onSort,
            isLoading,
            tableData: { Data: filteredData, TotalCount: filteredData?.length },
            tableColumns,
        };
    }, [isLoading, tableColumns, filteredData]);
    return (
        <TableWrapper loading={isLoading}>
            <TableTopContainer>
                <SearchInput
                    defaultValue={searchString}
                    debounce={100}
                    onChange={onSearch}
                    placeholder={i18nFilter()(
                        "segment.analysis.geography.table.search.placeholder",
                    )}
                    disableClear={true}
                />
                {tableExcelUrl && (
                    <>
                        <PlainTooltip tooltipContent={i18nFilter()("downloadCSV")}>
                            <ButtonContainer>
                                <ExcelButton
                                    url={tableExcelUrl}
                                    trackName="website analysis geography"
                                    className={"excel-button-wrapper"}
                                />
                            </ButtonContainer>
                        </PlainTooltip>
                    </>
                )}
            </TableTopContainer>
            <SWReactTable {...tableProps} />
        </TableWrapper>
    );
};
