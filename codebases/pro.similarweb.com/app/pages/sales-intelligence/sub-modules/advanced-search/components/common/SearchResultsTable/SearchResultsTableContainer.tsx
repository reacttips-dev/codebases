import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { toggleRightBar } from "pages/workspace/sales/sub-modules/common/store/action-creators";
import { selectWebsiteAction } from "pages/workspace/sales/sub-modules/opportunities-lists/store/action-creators";
import { selectRightBarIsOpen } from "pages/workspace/sales/sub-modules/common/store/selectors";
import { selectActiveWebsite } from "pages/workspace/sales/sub-modules/opportunities-lists/store/selectors";
import SearchResultsMultiSelectContainer from "../SearchResultsMultiSelect/SearchResultsMultiSelectContainer";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";
import usePersistedColumnsState from "../../../hooks/usePersistedColumnsState";
import SearchResultsTable from "./SearchResultsTable";
import TableColumnsSelection from "../TableColumnsSelection/TableColumnsSelection";
import { getSingularOrPluralKey } from "pages/sales-intelligence/helpers/helpers";
import { updateTableFiltersAction } from "../../../store/action-creators";
import {
    createSortedColumn,
    formatTableSearchResultsCount,
    updateColumnsWithSortValues,
} from "../../../helpers/table";
import {
    selectSearchResults,
    selectSearchResultsCount,
    selectSearchResultsFetching,
    selectTableFilters,
} from "../../../store/selectors";
import {
    StyledSearchResultsContainer,
    StyledResultsText,
    StyledNumberOfResults,
    StyledTableControlsContainer,
    StyledTableTopSection,
} from "./styles";

type SearchResultsTableContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootState) => ({
    tableFilters: selectTableFilters(state),
    searchResults: selectSearchResults(state),
    selectedWebsite: selectActiveWebsite(state),
    isRightSidebarOpened: selectRightBarIsOpen(state),
    searchResultsFetching: selectSearchResultsFetching(state),
    searchResultsCount: selectSearchResultsCount(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleRightBar,
            onWebsiteSelect: selectWebsiteAction,
            updateTableFilters: updateTableFiltersAction,
        },
        dispatch,
    );
};

const SearchResultsTableContainer = (props: SearchResultsTableContainerProps) => {
    const translate = useTranslation();
    const {
        tableFilters,
        searchResults,
        toggleRightBar,
        selectedWebsite,
        updateTableFilters,
        isRightSidebarOpened,
        searchResultsFetching,
        searchResultsCount,
        onWebsiteSelect,
    } = props;
    const [isSelectionColumnVisible, setIsSelectionColumnVisible] = React.useState(false);
    const getResultsTextTranslationKey = getSingularOrPluralKey(
        "si.components.advanced_search_results_table.results_text",
        true,
    );
    /** Current sorted column object */
    const sortedColumn = createSortedColumn(tableFilters.orderBy, tableFilters.asc);
    /** Current table columns */
    const [columns, setColumns] = usePersistedColumnsState();
    /** Toggling right sidebar on row click */
    const handleTableRowClick = (website: BaseWebsiteType) => {
        if (website.domain === selectedWebsite?.domain) {
            toggleRightBar(!isRightSidebarOpened);
        } else if (!isRightSidebarOpened) {
            toggleRightBar(true);
        }

        onWebsiteSelect(website);
    };

    React.useEffect(() => {
        setColumns(updateColumnsWithSortValues(columns, sortedColumn));
    }, [tableFilters.orderBy, tableFilters.asc]);

    return (
        <StyledSearchResultsContainer>
            <StyledTableTopSection>
                {!searchResultsFetching && (
                    <>
                        <StyledTableControlsContainer>
                            <StyledNumberOfResults>
                                <span>{formatTableSearchResultsCount(searchResultsCount)}</span>
                                <span>&nbsp;</span>
                                <StyledResultsText>
                                    {translate(getResultsTextTranslationKey(searchResultsCount))}
                                </StyledResultsText>
                            </StyledNumberOfResults>
                            <TableColumnsSelection
                                columns={columns}
                                onSelectionChange={setColumns}
                            />
                        </StyledTableControlsContainer>
                        <SearchResultsMultiSelectContainer
                            resultsTotalCount={searchResults.totalCount}
                            onSelectionColumnToggle={setIsSelectionColumnVisible}
                        />
                    </>
                )}
            </StyledTableTopSection>
            <SearchResultsTable
                tableColumns={columns}
                onRowClick={handleTableRowClick}
                tableData={searchResults}
                tableFilters={tableFilters}
                isLoading={searchResultsFetching}
                onFiltersChange={updateTableFilters}
                shouldHighlightSelectedRow={isRightSidebarOpened}
                isSelectionColumnVisible={isSelectionColumnVisible}
            />
        </StyledSearchResultsContainer>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SearchResultsTableContainer) as React.ComponentType<{}>;
