import React, { useEffect } from "react";
import { Pagination } from "@similarweb/ui-components/dist/pagination";
import { ExcelQuota, WebsiteData } from "pages/sales-intelligence/sub-modules/common/types";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { ColumnsPickerLite } from "@similarweb/ui-components/dist/columns-picker";
import {
    CommonTableFilters,
    CommonTableParams,
    CompetitorsCustomersNavParams,
    TrafficTableData,
    TrafficType,
} from "../../types";
import { getCorrectTableDataRequestParams, setIsSortedToFalse } from "../../helpers";
import { getTableColumns } from "../../configuration/table-columns";
import { COMPETITOR_CUSTOMERS_DEFAULT_PAGE_SIZE } from "../../constants/pagination";
import { getColumnsPickerLiteProps } from "pages/sales-intelligence/pages/find-leads/components/utils";
import { StyledTablePagination } from "pages/sales-intelligence/pages/opportunity-list/components/table/styles";
import CompetitorCustomersSubNav from "../CompetitorCustomersSubNav/CompetitorCustomersSubNav";
import CompetitorCustomersTableFilters from "../CompetitorCustomersTableFilters/CompetitorCustomersTableFilters";
import CompetitorsCustomersTable from "../CompetitorsCustomersTable/CompetitorsCustomersTable";
// TODO replace
import { StyledResultsPage, StyledSearchSection } from "./styles";
import { FlexTableSortedColumnType } from "pages/sales-intelligence/types";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import OutOfLimitModal from "pages/sales-intelligence/common-components/modals/OutOfLimitModal/OutOfModalLimit";
import { getQuotaModalInfo } from "pages/sales-intelligence/helpers/quotaModal/helpers";
import MultiSelector from "pages/sales-intelligence/common-components/MultiSelector/MulltiSelector";
import FindLeadsByCriteriaPageHeader from "pages/sales-intelligence/common-components/header/FindLeadsByCriteriaPageHeader/FindLeadsByCriteriaPageHeader";

type CompetitorsCustomersResultsPageProps = {
    domain: string;
    websiteData: WebsiteData;
    navigator: WithSWNavigatorProps["navigator"];
    tableData: TrafficTableData;
    tableDataFetching: boolean;
    categories: any[];
    trafficType: TrafficType;
    tableFilters: CommonTableFilters;
    excelDownloading: boolean;
    setTableFilters(filters: CommonTableFilters): void;
    downloadTableExcel<T extends CommonTableParams>(
        params: T,
        filters: CommonTableFilters,
        domains: any,
    ): void;
    fetchTableData<T extends CommonTableParams>(params: T, filters: CommonTableFilters): void;
    updateOpportunitiesList: any;
    listUpdating: boolean;
    usedLeadsLimits: number;
    activePanel: TypeOfSelectors;
    excelQuota: ExcelQuota;
    setMultiSelectorPanelByDefault(): void;
};

const CompetitorsCustomersResultsPage = (props: CompetitorsCustomersResultsPageProps) => {
    const translate = useTranslation();
    const {
        domain,
        websiteData,
        navigator,
        tableData,
        tableDataFetching,
        categories,
        trafficType,
        fetchTableData,
        excelDownloading,
        downloadTableExcel,
        tableFilters,
        setTableFilters,
        updateOpportunitiesList,
        listUpdating,
        usedLeadsLimits,
        activePanel,
        excelQuota,
        setMultiSelectorPanelByDefault,
    } = props;
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [tableColumns, setTableColumns] = React.useState(getTableColumns(translate));
    const [showCheckBoxColumn, toggleCheckBoxColumns] = React.useState(false);
    const [isOpenModal, toggleModal] = React.useState(false);
    const navigationParams = navigator.getParams() as CompetitorsCustomersNavParams;
    const tableDataRequestParams = React.useMemo(() => {
        return getCorrectTableDataRequestParams(navigationParams, trafficType, "Share desc");
    }, [trafficType, navigationParams]);
    const leadsLimit = useSalesSettingsHelper().getQuotaLimit();

    const handleBackClick = React.useCallback(() => {
        navigator.go("salesIntelligence-findLeads-competitors");
    }, []);

    const onWebsiteSelect = React.useCallback(
        (domain: string) => {
            navigator.applyUpdateParams({
                key: domain,
            });
        },
        [navigator],
    );

    const onTrafficTypeSelect = React.useCallback(
        (type: TrafficType) => {
            navigator.go(
                `salesIntelligence-findLeads-competitors-result-${type}`,
                navigator.getParams(),
            );
        },
        [navigator],
    );

    const handleCategorySelect = React.useCallback(
        // TODO: Add correct type.
        (category: { forApi: string }) => {
            setMultiSelectorPanelByDefault();
            setSelectedCategory(category);
            setTableFilters({ ...tableFilters, page: 1, category: category?.forApi ?? "" });
        },
        [tableFilters, setTableFilters],
    );

    const handlePageChange = React.useCallback(
        (page: number) => {
            setTableFilters({ ...tableFilters, page });
        },
        [tableFilters, setTableFilters],
    );

    const handleSearch = React.useCallback(
        (search: string) => {
            setMultiSelectorPanelByDefault();
            setTableFilters({ ...tableFilters, search, page: 1 });
        },
        [tableFilters, setTableFilters],
    );

    const handleColumnSort = React.useCallback(
        (sortedColumn: FlexTableSortedColumnType) => {
            const { field, sortDirection } = sortedColumn;

            setTableFilters({ ...tableFilters, orderBy: `${field} ${sortDirection}` });
        },
        [tableFilters, setTableFilters, tableColumns],
    );

    const handleColumnsToggle = React.useCallback(
        (columnIndexAsString: string, visible?: boolean) => {
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
        },
        [tableColumns],
    );

    const toggleCheckboxColumn = (visible: boolean) => {
        toggleCheckBoxColumns(visible);
    };

    React.useEffect(() => {
        const [field, sortDirection] = tableFilters.orderBy.split(" ");

        setTableColumns(
            tableColumns.map(setIsSortedToFalse).map((column: any) => {
                if (column.field === field) {
                    return {
                        ...column,
                        isSorted: true,
                        sortDirection,
                    };
                }

                return column;
            }),
        );
    }, [tableFilters.orderBy]);

    React.useEffect(() => {
        fetchTableData(tableDataRequestParams, tableFilters);
    }, [tableFilters]);

    // close MultiSelectorPanel and set up for panel default state
    useEffect(() => () => setMultiSelectorPanelByDefault(), []);

    const handleSubmitAccount = (
        opportunitiesList: OpportunityListType,
        opportunities: string[] | number,
    ) => {
        updateOpportunitiesList(
            tableDataRequestParams,
            tableFilters,
            opportunitiesList,
            opportunities,
        );
    };

    const handleDownloadExcel = (domains: number | string[]) => {
        downloadTableExcel(tableDataRequestParams, tableFilters, domains);
    };

    const quotaLimit = () => {
        return activePanel === TypeOfSelectors.ACCOUNT
            ? leadsLimit - usedLeadsLimits
            : excelQuota.remaining;
    };

    const handleClickOutOfMaxSelected = () => {
        toggleModal(true);
    };

    const onCloseModal = () => {
        toggleModal(false);
    };

    const { title, contentText } = getQuotaModalInfo(
        activePanel,
        excelQuota.total,
        leadsLimit,
        translate,
    );

    const isDisabledButtonExcel = excelDownloading || tableDataFetching || listUpdating;

    return (
        <StyledResultsPage>
            <FindLeadsByCriteriaPageHeader step={1} onBackClick={handleBackClick} />
            <CompetitorCustomersSubNav
                domain={domain}
                websiteData={websiteData}
                onWebsiteSelect={onWebsiteSelect}
            />
            <CompetitorCustomersTableFilters
                categories={categories}
                selectedTrafficType={trafficType}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                onTrafficTypeSelect={onTrafficTypeSelect}
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
            {!tableDataFetching && tableData.TotalCount > 0 && (
                <MultiSelector
                    totalCount={tableData.TotalCount}
                    tableSelectionKey="Metric"
                    tableSelectionProperty="Domain"
                    handleColumnsToggle={toggleCheckboxColumn}
                    handleSubmitAccount={handleSubmitAccount}
                    handleDownloadExcel={handleDownloadExcel}
                    initialState={[TypeOfSelectors.ACCOUNT, TypeOfSelectors.EXCEL]}
                    excelDownloading={excelDownloading}
                    disableButtonExcel={isDisabledButtonExcel}
                    disableButtonAccount={listUpdating || tableDataFetching}
                />
            )}
            <CompetitorsCustomersTable
                showCheckBoxColumn={showCheckBoxColumn}
                data={tableData}
                columns={tableColumns}
                onColumnSort={handleColumnSort}
                dataFetching={tableDataFetching || listUpdating}
                maxSelectedRows={quotaLimit()}
                handleClickOutOfMaxSelected={handleClickOutOfMaxSelected}
            />
            {!tableDataFetching && tableData.TotalCount > COMPETITOR_CUSTOMERS_DEFAULT_PAGE_SIZE && (
                <StyledTablePagination>
                    <Pagination
                        captionPosition="center"
                        page={tableFilters.page}
                        hasItemsPerPageSelect={false}
                        itemsCount={tableData.TotalCount}
                        handlePageChange={handlePageChange}
                        itemsPerPage={COMPETITOR_CUSTOMERS_DEFAULT_PAGE_SIZE}
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

export default CompetitorsCustomersResultsPage;
