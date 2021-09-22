import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { TablePager } from "@similarweb/ui-components/dist/table-pager";
import { tableActionsCreator } from "actions/tableActions";
import { showSuccessToast } from "actions/toast_actions";
import autobind from "autobind-decorator";
import { SWReactTableOptimizedWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import SegmentSelection from "components/React/TableSelectionComponents/SegmentSelection";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import * as _ from "lodash";
import { ICustomSegmentsTableContainerProps } from "pages/segments/analysis/CustomSegmentsTableContainer";
import React, { Component } from "react";
import { connect } from "react-redux";
import { allTrackers } from "services/track/track";
import styled from "styled-components";
import { defaultGetStableKey } from "../../../components/React/Table/SWReactTable";
import { i18nFilter } from "../../../filters/ngFilters";
import {
    CustomSegmentsTableColumnsConfigGen,
    SegmentsTableOptions,
} from "./CustomSegmentsTableConfig";
import { StyledSearchContainer, StyledTableWrapper } from "./StyledComponents";
import { ENABLE_FIREBOLT, SegmentsUtils } from "services/segments/SegmentsUtils";
import { IWithUseAdvancedPref, withUseAdvancedPref } from "pages/segments/withUseAdvancedPref";

const TablePagerContainer = styled.div`
    padding: 10px 15px;
    display: flex;
    flex-direction: row-reverse;
`;

export interface ICustomSegmentsOrgTableContainerProps
    extends ICustomSegmentsTableContainerProps,
        IWithUseAdvancedPref {}

export interface ICustomSegmentsOrgTableContainerState {
    searchString: string;
    displayPage: number;
    sortedColumn: {
        field: string;
        sortDirection: "desc" | "asc";
    };
}

const PAGE_SIZE = 100;
class CustomSegmentsOrgTableContainer extends Component<
    ICustomSegmentsOrgTableContainerProps,
    ICustomSegmentsOrgTableContainerState
> {
    constructor(props) {
        super(props);
        this.state = {
            searchString: "",
            displayPage: 1,
            sortedColumn: {
                field: "lastUpdated",
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

    @autobind
    public setPage(nextPage) {
        if (nextPage !== this.state.displayPage) {
            this.setState({
                displayPage: nextPage,
            });
        }
    }
    public getStableKey(index, col, row) {
        if (row) {
            const { id } = row;
            return `${id}`;
        }
        return defaultGetStableKey(index, col);
    }

    public render() {
        const {
            isLoading,
            tableData,
            showToast,
            clearAllSelectedRows,
            selectedRows,
            useAdvancedPref,
        } = this.props;
        const { sortedColumn, searchString, displayPage } = this.state;
        const fromRowIndex = displayPage * PAGE_SIZE - PAGE_SIZE;
        const toRowIndex = displayPage * PAGE_SIZE;
        let filteredData = [];
        if (!isLoading && tableData) {
            filteredData =
                !isLoading && searchString !== ""
                    ? _.filter(tableData, (dataItem: any) => {
                          return (
                              dataItem.domain.indexOf(searchString) !== -1 ||
                              dataItem.domain
                                  .concat(" " + dataItem.segmentName)
                                  .toLowerCase()
                                  .indexOf(searchString.toLowerCase()) !== -1
                          );
                      })
                    : tableData;
            filteredData = _.orderBy(filteredData, sortedColumn.field, sortedColumn.sortDirection);
            if (ENABLE_FIREBOLT && !useAdvancedPref.value) {
                filteredData = _.map(filteredData, (dataItem) =>
                    SegmentsUtils.isSegmentAdvanced(dataItem)
                        ? {
                              ...dataItem,
                              segmentAdvancedDisabled: true,
                              rowClass: "segmentRowDisabled",
                          }
                        : dataItem,
                );
            }
        }
        const numTablePages = Math.ceil(filteredData?.length / PAGE_SIZE);

        const tableProps = {
            onSort: this.onSort,
            tableOptions: {
                customPager: {
                    currentPage: displayPage,
                },
                ...SegmentsTableOptions(),
                customTableClass: "org-custom-segments-table",
                aboveHeaderComponents: [
                    <SegmentSelection
                        key="SegmentSelection"
                        showToast={showToast}
                        clearAllSelectedRows={clearAllSelectedRows}
                        selectedRows={selectedRows}
                        appendTo={".org-custom-segments-table .swReactTable-header-wrapper"}
                    />,
                ],
            },
            isLoading,
            tableData: {
                Data: filteredData.slice(fromRowIndex, toRowIndex),
                TotalCount: filteredData.length,
                Records: filteredData.slice(fromRowIndex, toRowIndex),
            },
            tableColumns: CustomSegmentsTableColumnsConfigGen(
                sortedColumn.field,
                sortedColumn.sortDirection,
                true,
            ),
            addPaddingRightCell: true,
            getStableKey: this.getStableKey,
            metric: "SegmentsTableMetric",
            tableSelectionKey: "OrgSegmentsTable",
            tableSelectionProperty: "id",
        };

        return (
            <StyledTableWrapper loading={isLoading}>
                <StyledSearchContainer>
                    <SearchInput
                        defaultValue={this.state.searchString}
                        debounce={100}
                        onChange={this.onSearch}
                        placeholder={i18nFilter()(
                            "custom.segment.analysis.table.search.placeholder",
                        )}
                    />
                </StyledSearchContainer>
                <SWReactTableOptimizedWithSelection {...tableProps} />
                <TablePagerContainer>
                    <TablePager page={displayPage} pages={numTablePages} gotoPage={this.setPage} />
                </TablePagerContainer>
            </StyledTableWrapper>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        tableSelection: { OrgSegmentsTable },
    } = state;
    return {
        selectedRows: OrgSegmentsTable,
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(tableActionsCreator("OrgSegmentsTable", "id").clearAllSelectedRows());
        },
        showToast: (href, text, label) => {
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText: label,
                        href,
                        onClick: () =>
                            allTrackers.trackEvent(
                                "create segments group",
                                "click",
                                "internal link",
                            ),
                    }),
                ),
            );
        },
    };
};

export default withUseAdvancedPref(
    connect(mapStateToProps, mapDispatchToProps)(CustomSegmentsOrgTableContainer),
);
