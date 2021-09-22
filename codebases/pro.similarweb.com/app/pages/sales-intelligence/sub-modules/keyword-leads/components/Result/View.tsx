import React, { useEffect } from "react";
import { Pagination } from "@similarweb/ui-components/dist/pagination";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { ColumnsPickerLite } from "@similarweb/ui-components/dist/columns-picker";
import { getColumnsPickerLiteProps } from "pages/sales-intelligence/pages/find-leads/components/utils";
import { StyledTablePagination } from "pages/sales-intelligence/pages/opportunity-list/components/table/styles";
import { StyledResultsPage, StyledSearchSection } from "../../../common/styles/result";
import { FlexTableSortedColumnType } from "pages/sales-intelligence/types";
import { Table } from "../Table/Table";
import { LEAD_ROUTES } from "../../../../pages/find-leads/constants/routes";
import { KeywordBarItemType, ParamsType, WebsiteItemType } from "../../types";
import { SubHeader } from "../SubHeader/View";
import useGroupService from "../../../../hooks/useGroupService";
import { TableFilters } from "../TableFilters/View";
import { getRequestParams } from "../../utils";
import { configs } from "../../config/allConfig";
import { KeywordLeadsType } from "../../types";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import MultiSelector from "pages/sales-intelligence/common-components/MultiSelector/MulltiSelector";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import OutOfLimitModal from "pages/sales-intelligence/common-components/modals/OutOfLimitModal/OutOfModalLimit";
import { getQuotaModalInfo } from "pages/sales-intelligence/helpers/quotaModal/helpers";
import FindLeadsByCriteriaPageHeader from "pages/sales-intelligence/common-components/header/FindLeadsByCriteriaPageHeader/FindLeadsByCriteriaPageHeader";

export const View = ({
    navigator,
    tableData,
    isFetching,
    keywordType,
    fetchData,
    excelDownloading,
    downloadTableExcel,
    tableFilters,
    setTableFilters,
    listUpdating,
    usedLeadsLimit,
    updateOpportunitiesList,
    excelQuota,
    activePanel,
    setMultiSelectorPanelByDefault,
}: KeywordLeadsType): JSX.Element => {
    const translate = useTranslation();
    const [sourceType, setSourceType] = React.useState("");
    const [searchType, setSearchType] = React.useState("");
    const [selectedWebsite, setSelectedWebsite] = React.useState(null);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [tableColumns, setTableColumns] = React.useState(configs.total);
    const [showCheckBoxColumn, toggleCheckBoxColumns] = React.useState(false);
    const [isOpenModal, toggleModal] = React.useState(false);

    const leadsLimit = useSalesSettingsHelper().getQuotaLimit();

    const navigationParams = navigator.getParams();

    const tableDataRequestParams = (): ParamsType => {
        return getRequestParams(navigationParams, "Share desc");
    };

    const handleBack = (): void => {
        navigator.go(LEAD_ROUTES.KEYWORDS);
    };

    const handlePageChange = (page: number): void => {
        setTableFilters({ ...tableFilters, page });
    };

    const handleSearch = (search: string): void => {
        setTableFilters({ ...tableFilters, search, page: 1 });
    };

    const handleColumnSort = (sortedColumn: FlexTableSortedColumnType): void => {
        const { field, sortDirection } = sortedColumn;
        setTableFilters({ ...tableFilters, orderBy: `${field} ${sortDirection}` });
    };

    const { keywordGroups, sharedGroupServices } = useGroupService();

    const preparedKeywordGroups = React.useMemo(() => {
        const sharedGroups = sharedGroupServices();
        const unitedKeywordGroups = [...sharedGroups, ...keywordGroups];

        return unitedKeywordGroups.map((item) => {
            return {
                id: `*${item.Id}`,
                text: item.Name,
                isShared: false,
                keywords: item.Keywords,
            };
        });
    }, [keywordGroups]);

    const handleColumnsToggle = (columnIndexAsString: string, visible?: boolean): void => {
        const columnIndex = Number(columnIndexAsString);

        setTableColumns(
            tableColumns.map((column, index) => {
                if (index === columnIndex) {
                    return {
                        ...column,
                        visible: typeof visible === "boolean" ? visible : !column.visible,
                    };
                }

                return column;
            }),
        );
    };

    const getTableData = (): void => {
        const params = tableDataRequestParams();
        fetchData(params, tableFilters);
    };

    React.useEffect((): void => {
        getTableData();
    }, [tableFilters]);

    // close MultiSelectorPanel and set up for panel default state
    useEffect(() => () => setMultiSelectorPanelByDefault(), []);

    // Filter handlers
    const onTableTypeSelect = ({ id }): void => {
        navigator.go(`salesIntelligence-findLeads-keyword-results-${id}`, navigator.getParams());
    };

    const handleSelectKeyword = (keyword: KeywordBarItemType) => {
        const nameOrId = keyword?.name || `*${keyword?.Id}`;
        navigator.applyUpdateParams({
            keyword: nameOrId,
        });
    };

    const handleCategorySelect = (category): void => {
        setMultiSelectorPanelByDefault();
        const preparedCategory = category && category.text ? category.text.split(" ")[0] : category;
        setSelectedCategory(preparedCategory);
        setTableFilters({ ...tableFilters, page: 1, category: category?.forApi ?? "" });
    };

    const handleSelectSourceType = (source): void => {
        setMultiSelectorPanelByDefault();
        setSourceType(source);
        setTableFilters({ ...tableFilters, family: source });
    };

    const handleSelectSearchType = (search): void => {
        setMultiSelectorPanelByDefault();
        setSearchType(search ? search.text : search);
        setTableFilters({ ...tableFilters, searchType: search ? search.id : search });
    };

    const handleSelectWebsite = (website: WebsiteItemType): void => {
        setMultiSelectorPanelByDefault();
        setSelectedWebsite(website);
        setTableFilters({ ...tableFilters, selectedWebsite: website });
    };

    const handleSubmitAccount = (
        selectedOpportunitiesList: OpportunityListType,
        opportunities: string[] | number,
    ) => {
        updateOpportunitiesList(
            tableDataRequestParams(),
            tableFilters,
            selectedOpportunitiesList,
            opportunities,
        );
    };

    const handleDownloadExcel = (domains: number | string[]) => {
        downloadTableExcel(tableDataRequestParams(), tableFilters, domains);
    };

    const toggleCheckboxColumn = (visible: boolean) => {
        toggleCheckBoxColumns(visible);
    };

    const quotaLimit = (): number => {
        return activePanel === TypeOfSelectors.ACCOUNT
            ? leadsLimit - usedLeadsLimit
            : excelQuota.remaining;
    };

    const handleClickOutOfMaxSelected = (): void => {
        toggleModal(true);
    };

    const onCloseModal = (): void => {
        toggleModal(false);
    };

    const { title, contentText } = getQuotaModalInfo(
        activePanel,
        excelQuota.total,
        leadsLimit,
        translate,
    );

    const isDisableButtonExcel = excelDownloading || isFetching || listUpdating;

    return (
        <StyledResultsPage>
            <FindLeadsByCriteriaPageHeader step={1} onBackClick={handleBack} />
            <SubHeader
                keyword={navigationParams.keyword}
                preparedKeywordGroups={preparedKeywordGroups}
                onSelectKeyword={handleSelectKeyword}
                isLoading={isFetching}
            />
            <TableFilters
                tableTypeProps={{
                    isFetching,
                    selectedTraffic: keywordType,
                    trafficTypes: Object.keys(configs),
                    setTraffic: onTableTypeSelect,
                }}
                sourceTypeProps={{
                    isFetching,
                    selectedSourceType: sourceType,
                    sourceTypeOptions: tableData?.Filters?.Source,
                    onSelectSourceType: handleSelectSourceType,
                }}
                searchTypeProps={{
                    isFetching,
                    selectedSearchType: searchType,
                    searchTypes: tableData?.Filters?.Type,
                    onSelectSearchType: handleSelectSearchType,
                }}
                categoryProps={{
                    isFetching,
                    selectedCategory,
                    onSelectCategory: handleCategorySelect,
                    allCategories: tableData?.Filters?.Category,
                }}
                websiteFilterProps={{
                    isFetching,
                    onSelectWebsiteType: handleSelectWebsite,
                    selectedWebsiteType: selectedWebsite,
                }}
            />
            <StyledSearchSection>
                <SearchInput
                    disableClear
                    debounce={400}
                    onChange={handleSearch}
                    defaultValue={tableFilters.search}
                    placeholder={translate("forms.search.placeholder")}
                />
                <ColumnsPickerLite
                    {...getColumnsPickerLiteProps(tableColumns, handleColumnsToggle)}
                />
            </StyledSearchSection>
            {tableData.TotalCount > 0 && !isFetching && (
                <MultiSelector
                    totalCount={tableData.TotalCount}
                    tableSelectionKey="Metric"
                    tableSelectionProperty="Domain"
                    initialState={[TypeOfSelectors.ACCOUNT, TypeOfSelectors.EXCEL]}
                    handleColumnsToggle={toggleCheckboxColumn}
                    handleSubmitAccount={handleSubmitAccount}
                    handleDownloadExcel={handleDownloadExcel}
                    excelDownloading={excelDownloading}
                    disableButtonExcel={isDisableButtonExcel}
                    disableButtonAccount={listUpdating || isFetching}
                />
            )}
            <Table
                showCheckBoxColumn={showCheckBoxColumn}
                data={tableData}
                columns={tableColumns}
                onColumnSort={handleColumnSort}
                isFetching={isFetching || listUpdating}
                maxSelectedRows={quotaLimit()}
                handleClickOutOfMaxSelected={handleClickOutOfMaxSelected}
            />
            {!isFetching && tableData.TotalCount > 100 && (
                <StyledTablePagination>
                    <Pagination
                        captionPosition="center"
                        page={tableFilters.page}
                        hasItemsPerPageSelect={false}
                        itemsCount={tableData.TotalCount}
                        handlePageChange={handlePageChange}
                        itemsPerPage={100}
                    />
                </StyledTablePagination>
            )}
            <OutOfLimitModal
                title={title}
                contentText={contentText}
                onClose={onCloseModal}
                isOpen={isOpenModal}
            />
        </StyledResultsPage>
    );
};
