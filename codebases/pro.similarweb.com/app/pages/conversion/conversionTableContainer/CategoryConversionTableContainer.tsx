import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import autobind from "autobind-decorator";
import * as _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import MultiColorSelectionTable from "../../../components/React/Table/MultiColorSelectionTable";
import { defaultGetStableKey } from "../../../components/React/Table/SWReactTable";
import { i18nFilter } from "../../../filters/ngFilters";
import { ISegmentsData } from "../../../services/conversion/ConversionSegmentsService";
import { ConversionSegmentsUtils } from "../ConversionSegmentsUtils";
import {
    CategoryConversionTableColumnsConfigGen,
    CategoryConversionTableOptions,
} from "./ConversionTableConfig";
import { SearchContainer, TableWrapper } from "./StyledComponents";
import swLog from "@similarweb/sw-log/index";

export interface ICategoryConversionTableContainerProps {
    selectedRows?: any[];
    tableData: any;
    isLoading?: boolean;
    tableSelectionKey: string;
    tableSelectionProperty: string;
    segments: ISegmentsData;
}

export interface ICategoryConversionTableContainerState {
    searchString: string;
    sortedColumn: {
        field: string;
        sortDirection: "desc" | "asc";
    };
}

class CategoryConversionTableContainer extends Component<
    ICategoryConversionTableContainerProps,
    ICategoryConversionTableContainerState
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
        const { isLoading, tableData, segments } = this.props;
        const { sortedColumn, searchString } = this.state;
        let filteredData = [];
        if (!isLoading && tableData) {
            // we first filter out segments with no metadata, this filter is a must because DI are deleting segments from time to time
            // and users still have those segments as custom assets.
            const segmentsData = _.filter(tableData?.Data, (dataItem: any) => {
                const segmentMetaData = ConversionSegmentsUtils.getSegmentById(
                    segments,
                    dataItem.SegmentId,
                );
                if (segmentMetaData === undefined) {
                    swLog.error(`Funnel Analysis Module : Segment Meta Data Is Missing: ${dataItem.SegmentId},
                     this usually happens when DI remove segments without notice`);
                }
                return segmentMetaData !== undefined;
            });

            filteredData =
                !isLoading && searchString !== ""
                    ? _.filter(segmentsData, (dataItem: any) => {
                          const segmentData = ConversionSegmentsUtils.getSegmentById(
                              segments,
                              dataItem.SegmentId,
                          );
                          return (
                              dataItem.Domain.indexOf(searchString) !== -1 ||
                              (segmentData &&
                                  dataItem.Domain.concat(" " + segmentData.segmentName)
                                      .toLowerCase()
                                      .indexOf(searchString.toLowerCase()) !== -1)
                          );
                      })
                    : segmentsData;
            filteredData = _.orderBy(filteredData, sortedColumn.field, sortedColumn.sortDirection);
        }

        const tableProps = {
            onSort: this.onSort,
            tableOptions: {
                tableSelectionTrackingParam: this.props.tableSelectionProperty,
                ...CategoryConversionTableOptions(),
            },
            isLoading,
            tableData: { Data: filteredData },
            tableColumns: CategoryConversionTableColumnsConfigGen(
                sortedColumn.field,
                sortedColumn.sortDirection,
                segments,
            ),
            getStableKey: this.getStableKey,
        };

        return (
            <TableWrapper loading={isLoading}>
                <SearchContainer>
                    <SearchInput
                        defaultValue={this.state.searchString}
                        debounce={100}
                        onChange={this.onSearch}
                        placeholder={i18nFilter()("category.conversion.table.search.placeholder")}
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

const mapStateToProps = ({ conversionModule: { segments } }) => {
    return {
        segments,
    };
};

export default connect(mapStateToProps, null)(CategoryConversionTableContainer);
