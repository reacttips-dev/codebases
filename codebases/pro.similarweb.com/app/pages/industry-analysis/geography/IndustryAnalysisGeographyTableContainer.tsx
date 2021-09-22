import { colorsPalettes, colorsSets } from "@similarweb/styles";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import autobind from "autobind-decorator";
import * as _ from "lodash";
import React, { Component, StatelessComponent } from "react";
import { connect } from "react-redux";
import MultiColorSelectionTable from "../../../components/React/Table/MultiColorSelectionTable";
import { SWReactTable } from "../../../components/React/Table/SWReactTable";
import { i18nFilter } from "../../../filters/ngFilters";
import {
    SearchContainer,
    TableWrapper,
} from "../../conversion/conversionTableContainer/StyledComponents";
import { IndustryAnalysisGeoTableColumnsConfigGen } from "./IndustryAnalysisGeoTableConfig";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ExcelButton, ExcelButtonWrapper } from "components/React/ExcelButton/ExcelButton";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

export interface IIndustryAnalysisGeographyTableContainerProps {
    selectedRows?: any[];
    tableData: any;
    isLoading?: boolean;
    tableSelectionKey: string;
    tableSelectionProperty: string;
    tableExcelUrl: string;
    countryTextByIdFilter: () => (val, na?: any) => string;
}

export interface IIndustryAnalysisGeographyTableContainerState {
    searchString: string;
    sortedColumn: {
        field: string;
        sortDirection: "desc" | "asc";
    };
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
// instead of using border-top, we simply use the TableTopDivider (defined above)
// to create an effect of a border.
export const TableTopContainer = styled(SearchContainer)`
    border-top: 0 none;
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

export class IndustryAnalysisGeographyTableContainer extends Component<
    IIndustryAnalysisGeographyTableContainerProps,
    IIndustryAnalysisGeographyTableContainerState
> {
    constructor(props) {
        super(props);
        this.state = {
            searchString: "",
            sortedColumn: {
                field: "TrafficShare",
                sortDirection: "desc",
            },
        };
    }

    @autobind
    public onSearch(val) {
        this.setState({
            searchString: val.trim().toLowerCase(),
        });
    }

    public onSort = ({ field, sortDirection }) => {
        this.setState({
            sortedColumn: {
                field,
                sortDirection,
            },
        });
    };

    public render() {
        const { isLoading, countryTextByIdFilter, tableExcelUrl } = this.props;
        const { sortedColumn } = this.state;
        let filteredData = [];
        if (!isLoading && this.props.tableData) {
            filteredData =
                !isLoading && this.state.searchString !== ""
                    ? _.filter(this.props.tableData.Data, (dataItem: any) => {
                          return (
                              countryTextByIdFilter()(dataItem[this.props.tableSelectionProperty])
                                  .toLowerCase()
                                  .indexOf(this.state.searchString) !== -1
                          );
                      })
                    : this.props.tableData.Data;
            filteredData = _.orderBy(filteredData, sortedColumn.field, sortedColumn.sortDirection);
        }
        const tableProps = {
            onSort: this.onSort,
            tableOptions: { tableSelectionTrackingParam: this.props.tableSelectionProperty },
            isLoading,
            tableData: { Data: filteredData },
            tableColumns: IndustryAnalysisGeoTableColumnsConfigGen(
                this.state.sortedColumn.field,
                this.state.sortedColumn.sortDirection,
            ),
        };

        return (
            <TableWrapper loading={isLoading}>
                <TableTopDivider />
                <TableTopContainer>
                    <SearchInput
                        defaultValue={this.state.searchString}
                        debounce={100}
                        onChange={this.onSearch}
                        placeholder={i18nFilter()(
                            "industry.analysis.geography.table.search.placeholder",
                        )}
                        disableClear={true}
                    />
                    <PlainTooltip tooltipContent={i18nFilter()("downloadCSV")}>
                        <ExcelButtonContainer>
                            <ExcelButton
                                url={tableExcelUrl}
                                trackName="industry analysis geography"
                                className={"excel-button-wrapper"}
                            />
                        </ExcelButtonContainer>
                    </PlainTooltip>
                </TableTopContainer>
                <MultiColorSelectionTable
                    {...this.props}
                    tableData={filteredData}
                    tableProps={tableProps}
                />
            </TableWrapper>
        );
    }
}
