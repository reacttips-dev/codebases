import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import autobind from "autobind-decorator";
import * as _ from "lodash";
import React, { PureComponent } from "react";
import { ICustomSegmentAvailableMembers, SegmentsUtils } from "services/segments/SegmentsUtils";
import MultiColorSelectionTable from "../../../../components/React/Table/MultiColorSelectionTable";
import { defaultGetStableKey } from "../../../../components/React/Table/SWReactTable";
import { i18nFilter } from "../../../../filters/ngFilters";
import { SegmentsGroupsAnalysisColumnsConfigGen } from "./SegmentsGroupsAnalysisTableConfig";
import { SearchContainer, TableWrapper } from "./StyledComponents";
import { SegmentsTableStyles } from "pages/segments/styleComponents";

export interface ISegmentsGroupsAnalysisTableContainerProps {
    selectedRows?: any[];
    tableData: any;
    isLoading?: boolean;
    tableSelectionKey: string;
    tableSelectionProperty: string;
    availableMembers: ICustomSegmentAvailableMembers;
}

export interface ISegmentsGroupsAnalysisTableContainerState {
    searchString: string;
    sortedColumn: {
        field: string;
        sortDirection: "desc" | "asc";
    };
}

class SegmentsGroupsAnalysisTableContainer extends PureComponent<
    ISegmentsGroupsAnalysisTableContainerProps,
    ISegmentsGroupsAnalysisTableContainerState
> {
    constructor(props) {
        super(props);
        this.state = {
            searchString: "",
            sortedColumn: {
                field: "Visits",
                sortDirection: "desc",
            },
        };
    }

    @autobind
    public onSearch(val) {
        this.setState({
            searchString: val.trim(),
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

    public getStableKey(index, col, row) {
        if (row) {
            const { SegmentId } = row;
            return `${SegmentId}`;
        }
        return defaultGetStableKey(index, col);
    }

    public render() {
        const { isLoading, tableData, availableMembers } = this.props;
        const { sortedColumn, searchString } = this.state;
        let filteredData = [];
        if (!isLoading && tableData) {
            filteredData =
                !isLoading && searchString !== ""
                    ? _.filter(tableData.Data, (dataItem: any) => {
                          const segmentData = SegmentsUtils.getSegmentById(
                              availableMembers,
                              dataItem.SegmentId,
                          );
                          return (
                              dataItem.SegmentDomain.indexOf(searchString) !== -1 ||
                              (segmentData &&
                                  dataItem.SegmentDomain.concat(" " + segmentData.segmentName)
                                      .toLowerCase()
                                      .indexOf(searchString.toLowerCase()) !== -1)
                          );
                      })
                    : tableData.Data;
            const [filteredGraphData, filteredDisabledData] = _.partition(
                filteredData,
                (data) => !data.isDisabled,
            );
            filteredData = [
                ..._.orderBy(
                    filteredGraphData,
                    (data) => data[sortedColumn.field] || "",
                    sortedColumn.sortDirection,
                ),
                ...filteredDisabledData,
            ];
        }

        const tableProps = {
            onSort: this.onSort,
            tableOptions: { tableSelectionTrackingParam: this.props.tableSelectionProperty },
            isLoading,
            tableData: { Data: filteredData },
            tableColumns: SegmentsGroupsAnalysisColumnsConfigGen(
                sortedColumn.field,
                sortedColumn.sortDirection,
            ),
            getStableKey: this.getStableKey,
        };

        return (
            <TableWrapper loading={isLoading}>
                <SegmentsTableStyles />
                <SearchContainer>
                    <SearchInput
                        defaultValue={this.state.searchString}
                        debounce={100}
                        onChange={this.onSearch}
                        placeholder={i18nFilter()(
                            "segments.group.analysis.table.search.placeholder",
                        )}
                    />
                </SearchContainer>
                <MultiColorSelectionTable
                    {...this.props}
                    tableProps={tableProps}
                    tableData={filteredData}
                />
            </TableWrapper>
        );
    }
}

export default SegmentsGroupsAnalysisTableContainer;
