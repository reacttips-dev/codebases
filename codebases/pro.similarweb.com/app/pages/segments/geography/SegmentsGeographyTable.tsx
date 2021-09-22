import * as React from "react";
import { colorsPalettes } from "@similarweb/styles";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import * as _ from "lodash";
import { countryTextByIdFilter, i18nFilter } from "../../../filters/ngFilters";
import {
    SearchContainer,
    TableWrapper,
} from "../../conversion/conversionTableContainer/StyledComponents";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ExcelButton } from "components/React/ExcelButton/ExcelButton";
import styled from "styled-components";
import { SegmentsAnalysisGeoTableColumnsConfigGen } from "./SegmentGeographyTableConfig";
import { SWReactTable } from "components/React/Table/SWReactTable";
import { useState } from "react";

export interface ISegmentAnalysisGeographyTableProps {
    tableData: any;
    isLoading?: boolean;
    tableExcelUrl?: string;
}

// We use a table top divider as a border,
// since the tableTopContainer bordrer had a bug
// related to boxSizing of the elements within it.
const TableTopDivider = styled.div`
    width: 100%;
    height: 1px;
    background-color: ${colorsPalettes.carbon[100]};
`;

// We disabled the border-top (that is defined in the searchContainer styled component)
// since it has a bug that has to do with box-sizing and elements it contains
// to create an effect of a border.
export const TableTopContainer = styled(SearchContainer)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .SearchInput-container {
        width: 100%;

        > div:first-child {
            top: 13px;
        }

        > .SearchInput {
            height: 48px;
        }
    }
`;

const ExcelButtonContainer = styled.div`
    margin-right: 16px;

    .excel-button-wrapper {
        bottom: 0px;
    }
`;

export const SegmentsGeographyTable = (props: ISegmentAnalysisGeographyTableProps) => {
    const [searchString, setSearchString] = useState("");
    const [sortedColumn, setSortedColumn] = useState<{
        field: string;
        sortDirection: "desc" | "asc";
    }>({
        field: "TrafficShare",
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
                    ? _.filter(tableData, (dataItem: any) => {
                          return (
                              countryTextByIdFilter()(dataItem.Country)
                                  .toLowerCase()
                                  .indexOf(searchString) !== -1
                          );
                      })
                    : tableData;
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

    const tableProps = {
        onSort,
        isLoading,
        tableData: { Data: filteredData },
        tableColumns: SegmentsAnalysisGeoTableColumnsConfigGen(
            sortedColumn.field,
            sortedColumn.sortDirection,
        ),
    };
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
                            <ExcelButtonContainer>
                                <ExcelButton
                                    url={tableExcelUrl}
                                    trackName="segments analysis geography"
                                    className={"excel-button-wrapper"}
                                />
                            </ExcelButtonContainer>
                        </PlainTooltip>
                    </>
                )}
            </TableTopContainer>
            <SWReactTable {...tableProps} />
        </TableWrapper>
    );
};
