import React, { useEffect, useState } from "react";
import { Pagination } from "@similarweb/ui-components/dist/pagination";
import { ListTableContainerProps } from "./ListTableContainer";
import OpportunityListPageContext from "../../context/OpportunityListPageContext";
import LegacySalesTableWrapper from "./LegacySalesTableWrapper/LegacySalesTableWrapper";
import useStaticListTrackingService from "../../../../hooks/useStaticListTrackingService";
import { StyledTablePagination, StyledTableContainer } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { RowDataItem } from "./types";
import { usePrevious } from "components/hooks/usePrevious";

const ListTable = ({
    workspaceId,
    tableFilters,
    listTableData,
    listTableDataFetching,
    isRightBarOpenSales,
    excelDownloading,
    excelQuota,
    activePanel,
    navigator,
    selectedWebsite,
    selectedCountry,
    recommendationsBarOpen,
    selectedOpportunityListName,
    isRightBarVisible,
    selectedSignalFilter,
    selectWebsite,
    fetchDataForRightBar,
    toggleRecommendationsBar,
    setShowRightBar,
    clearTableData,
    downloadToExcel,
    setTableFilters,
    fetchListTableData,
    removeOpportunitiesFromList,
    toggleRightBarSales,
    setMultiSelectorPanelByDefault,
}: ListTableContainerProps) => {
    const translate = useTranslation();
    const { list } = React.useContext(OpportunityListPageContext);

    const trackingService = useStaticListTrackingService();
    const [isOpenRecommendationByParams, setRecommendationByParams] = React.useState(false);
    const prevOpenRightSideBar = usePrevious(isRightBarOpenSales);
    const [isSignalsVisible, setIsSignalsVisible] = useState(false);

    useEffect(() => {
        if (selectedSignalFilter) {
            setIsSignalsVisible(true);
        } else {
            setIsSignalsVisible(false);
        }
    }, [selectedSignalFilter]);

    // Reacting to table filters change
    useEffect(() => {
        fetchListTableData(list.opportunityListId);
    }, [tableFilters]);

    // Reset all table filters on unmount
    useEffect(() => {
        return () => {
            setTableFilters({ ...tableFilters });
            selectWebsite(null);
            setShowRightBar(true);
            clearTableData();
        };
    }, []);

    useEffect(() => {
        const { showRecommendations, id } = navigator.getParams();

        if (!isOpenRecommendationByParams && showRecommendations === "true") {
            setRecommendationByParams(true);
            toggleRecommendationsBar(true);
            navigator.updateParams({ showRecommendations: null, id });
        }
    }, []);

    useEffect(() => {
        const { Data } = listTableData;

        if (
            isRightBarVisible &&
            Data.length &&
            selectedOpportunityListName.length &&
            !recommendationsBarOpen
        ) {
            setTimeout(() => {
                onRowSelected([], Data[0] as RowDataItem);
            }, 2000);
            setShowRightBar(false);
        }
    }, [listTableData, selectedWebsite]);

    /**
     * Handle table search
     */
    const handleSearch = React.useCallback(
        (search: string) => {
            setMultiSelectorPanelByDefault();
            setTableFilters({ ...tableFilters, search, page: 1 });
        },
        [tableFilters, setTableFilters],
    );

    /**
     * Handle table page change
     */
    const handlePageChange = React.useCallback(
        (page: number) => {
            setTableFilters({ ...tableFilters, page });
        },
        [tableFilters, setTableFilters],
    );

    /**
     * Handle separate column sort
     */
    const handleColumnSort = React.useCallback(
        (orderBy: string) => {
            setTableFilters({ ...tableFilters, orderBy, page: 1 });
        },
        [tableFilters, setTableFilters],
    );

    /**
     * Render different message for two separate cases
     */
    const emptyDataMessage = React.useMemo(() => {
        if (tableFilters.search.length === 0) {
            return translate("si.pages.single_list.table.no_data_text");
        }

        return translate("si.pages.single_list.table.empty_search_text");
    }, [tableFilters.search]);

    /**
     * Handle row selection
     */
    const onRowSelected = <T extends { site: string; favicon: string; index: number }>(
        _: unknown,
        args: T,
    ) => {
        const { site, favicon, index } = args;
        if (recommendationsBarOpen) {
            toggleRecommendationsBar(false);
        }

        if (selectedWebsite?.domain === site) {
            toggleRightBarSales(!isRightBarOpenSales);
        } else {
            trackingService.trackDomainSelected(
                isRightBarOpenSales ? "change" : "open",
                index + 1 + (tableFilters.page - 1) * tableFilters.pageSize,
            );
            selectWebsite({ domain: site, favicon });
            fetchDataForRightBar(site, list.opportunityListId, list.country, selectedCountry);
            !isRightBarOpenSales && toggleRightBarSales(!isRightBarOpenSales);
        }
    };

    /**
     * Handle separate websites delete via table selection
     */
    const onRemoveOpportunities = React.useCallback(
        (opportunities: { site: string }[]) => {
            removeOpportunitiesFromList(
                list,
                opportunities.map((opportunity) => opportunity.site),
            );
        },
        [list, removeOpportunitiesFromList],
    );

    return (
        <StyledTableContainer>
            <LegacySalesTableWrapper
                isSignalsVisible={isSignalsVisible}
                isSideBarClosed={!isRightBarOpenSales && prevOpenRightSideBar}
                list={list}
                activeSelectedRow
                data={listTableData}
                onSearch={handleSearch}
                workspaceId={workspaceId}
                onRowSelected={onRowSelected}
                onColumnSort={handleColumnSort}
                loading={listTableDataFetching}
                searchTerm={tableFilters?.search}
                emptyDataMessage={emptyDataMessage}
                onRemoveOpportunities={onRemoveOpportunities}
                initialActiveRow={isRightBarVisible && 0}
                downloadToExcel={downloadToExcel}
                excelDownloading={excelDownloading}
                excelQuota={excelQuota}
                activePanel={activePanel}
                setMultiSelectorPanelByDefault={setMultiSelectorPanelByDefault}
            />
            {!listTableDataFetching && listTableData.TotalCount > tableFilters.pageSize && (
                <StyledTablePagination>
                    <Pagination
                        captionPosition="center"
                        page={tableFilters.page}
                        hasItemsPerPageSelect={false}
                        handlePageChange={handlePageChange}
                        itemsPerPage={tableFilters.pageSize}
                        itemsCount={listTableData.TotalCount}
                    />
                </StyledTablePagination>
            )}
        </StyledTableContainer>
    );
};

export default ListTable;
