import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { tableActionsCreator } from "actions/tableActions";
import { showSuccessToast } from "actions/toast_actions";
import autobind from "autobind-decorator";
import { SWReactTableOptimizedWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import SegmentSelection from "components/React/TableSelectionComponents/SegmentSelection";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import * as _ from "lodash";
import { StyledNoData } from "pages/website-analysis/audience-loyalty/StyledComponents";
import { NoSuggestionsArt } from "pages/workspace/common/arts/WorkspaceArts";
import React, { Component } from "react";
import { connect } from "react-redux";
import { allTrackers } from "services/track/track";
import { defaultGetStableKey } from "../../../components/React/Table/SWReactTable";
import { i18nFilter } from "../../../filters/ngFilters";
import {
    CustomSegmentsTableColumnsConfigGen,
    SegmentsTableOptions,
} from "./CustomSegmentsTableConfig";
import { NoDataContainer, StyledSearchContainer, StyledTableWrapper } from "./StyledComponents";
import { ENABLE_FIREBOLT, SegmentsUtils } from "services/segments/SegmentsUtils";
import { IWithUseAdvancedPref, withUseAdvancedPref } from "pages/segments/withUseAdvancedPref";

export interface ICustomSegmentsTableContainerProps extends IWithUseAdvancedPref {
    tableData: any;
    isLoading?: boolean;
    clearAllSelectedRows: () => void;
    showToast: (href, text, label) => void;
    selectedRows: any;
    prefUseAdvanced: { value: boolean; isLoading: boolean };
}

export interface ICustomSegmentsTableContainerState {
    searchString: string;
    sortedColumn: {
        field: string;
        sortDirection: "desc" | "asc";
    };
}

class CustomSegmentsTableContainer extends Component<
    ICustomSegmentsTableContainerProps,
    ICustomSegmentsTableContainerState
> {
    private noDataTexts: { subtitle: string; title: string };
    constructor(props) {
        super(props);
        this.state = {
            searchString: "",
            sortedColumn: {
                field: "lastUpdated",
                sortDirection: "desc",
            },
        };
        this.noDataTexts = {
            title: "segment.home.mysegments.table.no.data.title",
            subtitle: "segment.home.mysegments.table.no.data.subtitle",
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
        const { sortedColumn, searchString } = this.state;
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

        const tableProps = {
            onSort: this.onSort,
            tableOptions: {
                ...SegmentsTableOptions(),
                customTableClass: "my-custom-segments-table",
                aboveHeaderComponents: [
                    <SegmentSelection
                        key="mySegmentSelection"
                        showToast={showToast}
                        clearAllSelectedRows={clearAllSelectedRows}
                        selectedRows={selectedRows}
                        appendTo={".my-custom-segments-table .swReactTable-header-wrapper"}
                    />,
                ],
            },
            isLoading,
            tableData: {
                Data: filteredData,
                TotalCount: filteredData.length,
                Records: filteredData,
            },
            tableColumns: CustomSegmentsTableColumnsConfigGen(
                sortedColumn.field,
                sortedColumn.sortDirection,
            ),
            addPaddingRightCell: true,
            getStableKey: this.getStableKey,
            metric: "SegmentsTableMetric",
            tableSelectionKey: "MySegmentsTable",
            tableSelectionProperty: "id",
        };

        return (
            <StyledTableWrapper loading={isLoading}>
                {!isLoading && tableData?.length === 0 ? (
                    <NoDataContainer>
                        {" "}
                        <StyledNoData
                            title={this.noDataTexts.title}
                            subtitle={this.noDataTexts.subtitle}
                            SvgImage={NoSuggestionsArt}
                        />{" "}
                    </NoDataContainer>
                ) : (
                    <>
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
                    </>
                )}
            </StyledTableWrapper>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        tableSelection: { MySegmentsTable },
    } = state;
    return {
        selectedRows: MySegmentsTable,
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(tableActionsCreator("MySegmentsTable", "id").clearAllSelectedRows());
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
    connect(mapStateToProps, mapDispatchToProps)(CustomSegmentsTableContainer),
);
