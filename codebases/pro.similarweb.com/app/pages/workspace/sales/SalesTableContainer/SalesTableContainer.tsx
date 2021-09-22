/* eslint-disable @typescript-eslint/camelcase */
import { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import queryString from "query-string";
import styled from "styled-components";
import dayjs from "dayjs";
import { memoize, compact } from "lodash";

import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { getCountries } from "components/filters-bar/utils";
import { Icon } from "components/GroupCreationDropdown/src/GroupCreationDropdownItem";
import LocationService from "components/Modals/src/UnlockModal/LocationService";
import { CircularLoader } from "components/React/CircularLoader";
import { ColumnsPickerModal } from "components/React/ColumnsPickerModal/ColumnsPickerModal";
import {
    CLEAR_HIGHLIGHT_CLICKED_ROW_EVENT,
    UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT,
} from "components/React/Table/FlexTable/Big/FlexTable";
import { defaultGetStableKey } from "components/React/Table/SWReactTable";
import { SWReactTableOptimizedWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { i18nFilter } from "filters/ngFilters";
import { getTableToggleGroups } from "pages/lead-generator/lead-generator-exist/leadGeneratorExistConfig";
import { IRecommendationTile } from "pages/workspace/common components/RecommendationsSidebar/RecommendationsSidebar";
import { openUnlockModal } from "services/ModalService";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import UnlockModal from "../../../../../.pro-features/components/Modals/src/UnlockModal/UnlockModal";
import UnlockModalConfig from "../../../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import { ISwSettings } from "../../../../@types/ISwSettings";
import I18n from "../../../../components/React/Filters/I18n";
import SalesWorkspaceApiService from "../../../../services/workspaces/salesWorkspaceApiService";
import { commonActionCreators } from "../../common/actions_creators/COPY_common_worksapce_action_creators";
import {
    selectActiveOpportunityList,
    selectSizeActiveOpportunityLeadsInList,
} from "../../common/selectors";
import { TablePager } from "../../common/TablePager";
import { TableSelectionComponent } from "../../common/TableSelectionComponent";
import { IOpportunitiesListTable, IOpportunityListItem } from "../../common/types";
import { shouldLockModule } from "../../common/workspacesUtils";

/** Local Import */
import { TableWrapper } from "../../StyledComponent";
import { UNSUBSCRIBE_CANCEL } from "../constants/constants";
import { getColumns, getOptions } from "./SalesTableConfig";
import predefinedViews from "pages/workspace/sales/SalesTableContainer/predefinedViews";
import SalesTableHeader from "pages/workspace/sales/components/SalesTableHeader/SalesTableHeader";
import { AddOpportunitiesButtonOption } from "pages/workspace/common components/AddOpportunitiesButton/src/AddOpportunitiesButton";
import "./SalesTableContainer.scss";
import { fetchSignalsForCountryThunkAction } from "pages/workspace/sales/sub-modules/signals/store/effects";
import { selectUpdatingList } from "pages/workspace/sales/sub-modules/opportunities-lists/store/selectors";
import { RootState } from "single-spa/store/types";
import { setSignalsActiveTabAction } from "pages/workspace/sales/sub-modules/signals/store/action-creators";
import {
    ProductTours,
    ProductToursLocalStorageKeys,
    showIntercomTour,
} from "services/IntercomProductTourService";
import { PreferencesService } from "services/preferences/preferencesService";

export interface ISalesTableProps {
    updatingList: boolean;
    isTableLoading: boolean;
    workspaceId: string;
    opportunityListId: string;
    enableFindOpportunities: boolean;
    isWebsitesModalOpen: boolean;
    data: any;
    opportunities: any;
    lastSnapshotDate: any;
    onFilter: (a) => void;
    onDataUpdate: () => void;
    setLoadingTable: () => void;
    onRemoveOpportunities: (a) => void;
    openWebsitesModal: () => void;
    onFindWebsites: () => void;
    goToDashboardTemplate: (a, b, c, d, e?) => void;
    showErrorToast: (text) => void;
    editOpportunityList: (activeWorkspaceId, list) => void;
    activeWorkspaceId: string;
    activeList: IOpportunityListItem;
    toggleRecommendations: (isOpen?) => void;
    searchTableList: (term: string) => void;
    sortTableList: (orderBy: string) => void;
    tableSearchTerm: string;
    isGeneratorLimited?: boolean;
    checkIsGeneratorLocked?: () => Promise<boolean>;
    subscribeEmailDigest: (workspaceId: string, opportunityListId: string) => Promise<boolean>;
    unSubscribeEmailDigest: (workspaceId: string, opportunityListId: string) => Promise<boolean>;
    impersonateMode: boolean;
    activeListData: IOpportunitiesListTable;
    recommendations: IRecommendationTile[];
    sizeOpportunityLeadsInList: number;
    onRowSelected(event, row);

    changeCountry(
        workspaceId: string,
        opportunityListId: string,
        activeList: IOpportunityListItem,
        country: number,
    );
    fetchListOpportunities(
        workspaceId: string,
        opportunityListId: string,
        params?: {
            [key: string]: string | number;
        },
    ): void;
    fetchRecommendations(workspaceId: string, opportunityListId: string): void;
    fetchSignals(workspaceId: string, opportunityListId: string, countryCode: number): void;
    activeSelectedRow: boolean;
}

export interface ISalesTableState {
    visibleColumns: Record<string, { visible: boolean; index: number }>;
    sortedColumn: { field: string; sortDirection: string };
    page: number;
    isColumnsPickerOpen: boolean;
    opportunityListId: string;
    countries: any[];
    isUnlockModalOpen?: boolean;
    unlockModalConfig?: string;
    isGeneratorLocked: boolean;
    isGeneratorLoading: boolean;
    isShowedSubscribeNowEmailDigestModal: boolean;
    isShowedFeed: boolean;
    isShowedUnsubscribe: boolean;
    isShowedRecommendations: boolean;
    isLoadingSubscribe: boolean;
    selectedViewId: string;
}

const StyledLoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 148px; // Dropdown width - paddings
    height: 48px;
`;

const StyledLockedItem = styled.div`
    display: flex;
    align-items: flex-end;
    opacity: 0.5;

    ${Icon} {
        width: 18px;
        margin-right: 7px;
    }
`;

interface Props {
    title: string;
    subtitle: string;
}

const StyledOptionDescription = styled.div`
    opacity: 0.6;
    width: inherit;
    word-break: break-word;
    white-space: normal;
    font-size: 12px;
`;

const Option: React.FC<Props> = ({ title, subtitle }) => (
    <>
        <I18n component="div">{title}</I18n>
        <I18n component={StyledOptionDescription}>{subtitle}</I18n>
    </>
);

const SUBSCRIBE_NOW_EMAIL_DIGEST_POPUP = "subscribeNowEmailDigestPopup"; // TODO change for prod
const predefinedViewOptions = Object.values(predefinedViews.PREDEFINED_VIEW_IDS).filter(
    (option) => option !== predefinedViews.PREDEFINED_VIEW_IDS.CUSTOM,
);

class TableContainer extends PureComponent<ISalesTableProps, ISalesTableState> {
    public swNavigator: any;
    public swSettings: ISwSettings;
    private columns = getColumns();
    private itemsPerPage = 25;
    private readonly isCustomMetricsLocked: boolean;
    private readonly isExcelAllowed: boolean;
    private readonly uuidSubscribeNowEmailDigestPopup: string;
    private readonly isFroUser: boolean;
    private readonly tableToggleGroups: any;

    constructor(props, context) {
        super(props, context);

        predefinedViews.init(this.props.workspaceId);
        const selectedViewId = predefinedViews.currentViewId;

        this.swNavigator = Injector.get<any>("swNavigator");
        this.swSettings = swSettings;
        this.tableToggleGroups = getTableToggleGroups().map((obj) => ({
            ...obj,
            displayName: i18nFilter()(obj.displayName),
        }));
        this.isCustomMetricsLocked = shouldLockModule(
            this.swSettings.components.WsCustomMetrics.resources.AvaliabilityMode,
        );
        this.isExcelAllowed = this.swSettings.components.Home.resources.IsExcelAllowed as boolean;

        this.uuidSubscribeNowEmailDigestPopup = `${SUBSCRIBE_NOW_EMAIL_DIGEST_POPUP}=${props.opportunityListId}`;
        this.isFroUser = this.swSettings.user.isFro;

        this.state = {
            visibleColumns: predefinedViews.getCurrentView(),
            sortedColumn: {
                field: "visits",
                sortDirection: "desc",
            },
            page: 1,
            isColumnsPickerOpen: false,
            countries: getCountries(),
            opportunityListId: props.opportunityListId,
            isUnlockModalOpen: false,
            unlockModalConfig: "",
            isGeneratorLocked: false,
            isGeneratorLoading: true,
            isShowedSubscribeNowEmailDigestModal: false,
            isShowedRecommendations: false,
            isShowedFeed: false,
            isShowedUnsubscribe: false,
            isLoadingSubscribe: false,
            selectedViewId,
        };
    }

    componentDidMount() {
        this.runIntercomTour();
    }

    public componentDidUpdate() {
        this.isOpenRightBarFromUrl();
        this.isOpenUnsubscribeFromUrl();
        this.isOpenRecommendationsFromUrl();
        this.shouldShowSubscribeNowEmailDigestModal();
    }

    runIntercomTour() {
        const isTourAlreadySeen = localStorage.getItem(
            ProductToursLocalStorageKeys.StaticListPageSI1Tour,
        );

        if (isTourAlreadySeen === "true") {
            return;
        }

        showIntercomTour(ProductTours.StaticListPageSI1);
        localStorage.setItem(ProductToursLocalStorageKeys.StaticListPageSI1Tour, "true");
    }

    public editOpportunityList = () => {
        const { activeWorkspaceId, activeList, editOpportunityList } = this.props;
        editOpportunityList(activeWorkspaceId, activeList);
    };

    public changeCountry = ({ id }): void => {
        const { workspaceId, opportunityListId, activeList, changeCountry } = this.props;

        changeCountry(workspaceId, opportunityListId, activeList, id);
    };

    public onClickRecommendationsIndicator = (isOpen?) => {
        allTrackers.trackEvent("similar sites", "expand", "show similar sites");
        this.props.toggleRecommendations(isOpen);
        $("body").trigger(CLEAR_HIGHLIGHT_CLICKED_ROW_EVENT);
    };

    public onOpenDropdown = async (isOpen) => {
        const { isGeneratorLimited, checkIsGeneratorLocked } = this.props;
        const { isGeneratorLocked } = this.state;

        if (isOpen) allTrackers.trackEvent("Drop down", "open", "add sites to list");

        if (isOpen && checkIsGeneratorLocked && isGeneratorLimited && isGeneratorLocked !== true) {
            const value = await checkIsGeneratorLocked();

            if (isGeneratorLocked !== value) {
                this.setState({ isGeneratorLocked: value });
            }
        }

        this.setState({ isGeneratorLoading: false });
    };

    private shouldShowSubscribeNowEmailDigestModal = async () => {
        const {
            isWebsitesModalOpen,
            impersonateMode,
            activeList: { isSubscriptionActive },
        } = this.props;
        const { isLoadingSubscribe, isShowedSubscribeNowEmailDigestModal } = this.state;

        if (isLoadingSubscribe) {
            return;
        }

        if (
            !isWebsitesModalOpen &&
            !isSubscriptionActive &&
            !impersonateMode &&
            !this.isFroUser &&
            !isShowedSubscribeNowEmailDigestModal
        ) {
            const isUserDataPreferences = await PreferencesService.get(
                this.uuidSubscribeNowEmailDigestPopup,
            );

            if (!isUserDataPreferences) {
                this.setState({ isShowedSubscribeNowEmailDigestModal: true });
                allTrackers.trackEvent("Pop up", "open", "List email update");
            }
        }
    };

    public clickSubscribeBtnEmailDigest = async (
        isSubscribe: boolean,
        typeOfTrackEvent: string,
    ) => {
        const {
            workspaceId,
            opportunityListId,
            sizeOpportunityLeadsInList,
            subscribeEmailDigest,
            unSubscribeEmailDigest,
        } = this.props;
        const eventName = {
            SUBSCRIBE_FROM_POP_UP: "List email update/subscribe from pop up",
            SUBSCRIBE_FROM_TOP_BUTTON: "List email update/subscribe from top button",
            UNSUBSCRIBE_CONFIRMED: "List email update/unsubscribe confirmed",
        }[typeOfTrackEvent];

        if (this.state.isLoadingSubscribe) {
            return;
        }

        this.setState({ isLoadingSubscribe: true });

        if (isSubscribe) {
            this.setState({ isShowedSubscribeNowEmailDigestModal: false });
            await PreferencesService.add({ [this.uuidSubscribeNowEmailDigestPopup]: true });
            await subscribeEmailDigest(workspaceId, opportunityListId);
        } else {
            this.closeUnsubscribeEmailDigestModal("");
            await unSubscribeEmailDigest(workspaceId, opportunityListId);
        }

        if (eventName) {
            allTrackers.trackEvent("button", "click", eventName, sizeOpportunityLeadsInList);
        }

        this.setState({ isLoadingSubscribe: false });
    };

    private closeUnsubscribeEmailDigestModal = (typeOfTrackEvent: string) => {
        this.updateUrlParams();

        if (typeOfTrackEvent === UNSUBSCRIBE_CANCEL) {
            allTrackers.trackEvent(
                "button",
                "click",
                "List email update/unsubscribe cancel",
                this.props.sizeOpportunityLeadsInList,
            );
        }
    };

    private isOpenRightBarFromUrl = () => {
        const totalCount = this.props.activeListData?.TotalCount ?? 0;

        const { domain, showFeed } = this.swNavigator.getParams();

        if (totalCount && !this.state.isShowedFeed && showFeed === "true" && domain !== "") {
            const {
                site,
                favicon,
                site_category,
                medium_image,
                large_image,
                number_of_unseen_alerts,
            } = this.props.activeListData.Records.find((item) => item.site === domain);

            this.props.onRowSelected(null, {
                site,
                favicon,
                site_category,
                medium_image,
                large_image,
                number_of_unseen_alerts,
                selectedTab: "ANALYSIS_TAB",
            });

            this.updateUrlParams();

            this.setState({
                isShowedFeed: true,
            });
        }
    };

    private isOpenRecommendationsFromUrl = () => {
        const recommendationList = this.props.recommendations ?? [];
        const { showRecommendations } = this.swNavigator.getParams();

        if (
            recommendationList.length &&
            !this.state.isShowedRecommendations &&
            showRecommendations === "true"
        ) {
            this.updateUrlParams();

            this.onClickRecommendationsIndicator(true);

            this.setState({
                isShowedRecommendations: true,
            });
        }
    };

    private isOpenUnsubscribeFromUrl = () => {
        const { showUnsubscribe } = this.swNavigator.getParams();

        if (!this.state.isShowedUnsubscribe && showUnsubscribe === "true") {
            this.updateUrlParams();

            this.setState({
                isShowedUnsubscribe: true,
            });
        }
    };

    getOption() {
        const { onFindWebsites } = this.props;
        const { isGeneratorLoading, isGeneratorLocked } = this.state;

        if (isGeneratorLoading) {
            return {
                label: (
                    <StyledLoaderWrapper>
                        <CircularLoader
                            options={{
                                svg: {
                                    cx: "50%",
                                    cy: "50%",
                                    r: "10",
                                    stroke: "#dedede",
                                    strokeWidth: "3",
                                },
                                style: {
                                    width: "24px",
                                    height: "24px",
                                },
                            }}
                        />
                    </StyledLoaderWrapper>
                ),
                key: "workspace.sales.loading",
            };
        } else if (isGeneratorLocked) {
            return {
                label: (
                    <StyledLockedItem>
                        <Icon iconName="locked" />
                        <I18n>workspace.sales.add.find</I18n>
                    </StyledLockedItem>
                ),
                action: () => {
                    openUnlockModal(
                        {
                            modal: "SourceOpportunities",
                            slide: "SourceOpportunities",
                        },
                        `${LocationService.getCurrentLocation()}/TrialBanner`,
                    );
                },
                key: "workspace.sales.add.find",
            };
        }

        return {
            label: (
                <Option
                    title="workspace.sales.add.find"
                    subtitle="workspace.sales.add.findDescription"
                />
            ),
            action: () => {
                allTrackers.trackEvent(
                    "Internal link",
                    "click",
                    `Find leads/from list/${this.props.data?.TotalCount ?? 0}`,
                );
                onFindWebsites();
            },
            key: "workspace.sales.add.find",
            ellipsisDropdownItemProps: {
                iconName: "search-keywords",
                className: "more_leads__item",
                iconSize: "md",
            },
        };
    }

    public onRemoveOpportunities = async (itemsToRemove) => {
        const { workspaceId, opportunityListId, activeList, fetchSignals } = this.props;
        TrackWithGuidService.trackWithGuid(
            "workspace_sales_remove_opportunities_from_table.button",
            "click",
            {
                totalCount: this.props.data.TotalCount,
                itemsToRemove: itemsToRemove?.length ?? 0,
            },
        );

        const shouldFetchData = this.props.data.TotalCount > this.itemsPerPage;
        if (shouldFetchData) {
            this.props.setLoadingTable();
            await this.props.onRemoveOpportunities(itemsToRemove);
            this.onPaging(1);
        } else {
            await this.props.onRemoveOpportunities(itemsToRemove);
        }

        fetchSignals(workspaceId, opportunityListId, activeList.country);

        $("body").trigger(UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT);
    };

    public getStableKey(index, col, row) {
        if (row) {
            const { site, country } = row;
            return `${site}_${country}`;
        }
        return defaultGetStableKey(index, col);
    }

    public getVisibleColumns = memoize(({ sortedColumn, visibleColumns }) =>
        this.columns
            .map((col) => {
                const sortedProps = col.field === sortedColumn?.field && {
                    isSorted: true,
                    sortDirection: sortedColumn.sortDirection,
                };

                return {
                    ...col,
                    ...sortedProps,
                    visible: !col.field || visibleColumns[col.field]?.visible || col.fixed,
                };
            })
            .sort((a, b) => {
                if (a.visible && !b.visible) return -1;
                if (!a.visible && b.visible) return 1;

                if (visibleColumns[a.field]?.index < visibleColumns[b.field]?.index) return -1;
                if (visibleColumns[a.field]?.index > visibleColumns[b.field]?.index) return 1;
                return 0;
            }),
    );

    public toggleColumnsPicker = (toVal: boolean, shouldReset?: boolean) => {
        if (this.isCustomMetricsLocked) {
            this.setState({
                isUnlockModalOpen: true,
                unlockModalConfig: "CustomMetrics",
            });

            return;
        }

        allTrackers.trackEvent(
            "Dropdown",
            this.state.isColumnsPickerOpen ? "close" : "open",
            "Sales reports/edit columns",
        );

        if (!this.state.isColumnsPickerOpen) {
            allTrackers.trackEvent("Pop up", "open", "Edit columns");
        }

        this.setState(({ selectedViewId }) => {
            const { workspaceId } = this.props;
            const newState: any = { isColumnsPickerOpen: toVal };

            if (shouldReset) {
                predefinedViews.setPredefinedViewId(workspaceId, selectedViewId);

                newState.visibleColumns = predefinedViews.getCurrentView();
            }

            return newState;
        });
    };

    public onApplyColumnsPicker = (columns: any[]) => {
        const config = predefinedViews.saveCustomColumnsConfig(this.props.workspaceId, columns);

        allTrackers.trackEvent("Drop down", "Click", "Header/custom predefined view");

        this.setState(
            {
                isColumnsPickerOpen: false,
                visibleColumns: config,
                selectedViewId: predefinedViews.PREDEFINED_VIEW_IDS.CUSTOM,
            },
            () => {
                $("body").trigger(UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT);
            },
        );
    };

    handleViewChange = ({ id: selectedViewId }: { id: string }) => {
        const { workspaceId } = this.props;
        const isCustomViewSelected = selectedViewId === predefinedViews.PREDEFINED_VIEW_IDS.CUSTOM;

        if (isCustomViewSelected && !predefinedViews.hasCustomView) {
            this.toggleColumnsPicker(true);

            return;
        }

        const eventName =
            selectedViewId === predefinedViews.PREDEFINED_VIEW_IDS.CUSTOM
                ? "Header/custom predefined view"
                : `Header/regular predefined view/${selectedViewId}`;

        allTrackers.trackEvent("Drop down", "Click", eventName);

        predefinedViews.setPredefinedViewId(workspaceId, selectedViewId);

        this.setState({
            selectedViewId,
            visibleColumns: predefinedViews.PREDEFINED_VIEWS[selectedViewId],
        });
    };

    public parseFilter = (key, value) => {
        if (key === "filter") {
            return `Site;contains;"${value}"`;
        } else if (key === "orderBy") {
            return `${value.field} ${value.sortDirection}`;
        }
    };

    public updateParams = (key?, value?) => {
        const { page, sortedColumn } = this.state;
        const filters: any = { page };
        if (sortedColumn) {
            filters.orderBy = this.parseFilter("orderBy", sortedColumn);
        }

        if (key && value) {
            filters[key] = value;
            if (key === "filter") {
                delete filters.page;
            }
        }

        this.props.onFilter(filters);
    };

    public onSort = (sortedColumn) => {
        this.setState({ sortedColumn }, () => {
            const orderBy = this.parseFilter("orderBy", sortedColumn);
            this.props.sortTableList(orderBy);
            this.updateParams("orderBy", orderBy);
        });
    };

    public onSearch = (searchString) => {
        this.setState(
            {
                page: 1,
            },
            () => {
                this.props.searchTableList(searchString);
                this.updateParams();
            },
        );
    };

    public onPaging = (page) => {
        this.setState({ page }, () => this.updateParams("page", page));
    };

    public onExcelDownloadClick = (event) => {
        if (event && !this.isExcelAllowed) {
            event.preventDefault();

            this.setState({
                isUnlockModalOpen: true,
                unlockModalConfig: "DownloadTable",
            });
        }
        allTrackers.trackEvent("Download", "submit-ok", "Table/Download Excel");
    };

    public updateUrlParams = () => {
        const { workspaceId, opportunityListId } = this.props;

        this.swNavigator.applyUpdateParams({
            workspaceId,
            listId: opportunityListId,
            domain: null,
            showFeed: null,
            showRecommendations: null,
            showUnsubscribe: null,
        });
    };

    handleSignalChange = (eventFilterType?: string, eventFilterSubType?: string): void => {
        const {
            workspaceId,
            opportunityListId,
            fetchRecommendations,
            fetchListOpportunities,
        } = this.props;

        fetchListOpportunities(workspaceId, opportunityListId, {
            eventFilterType,
            eventFilterSubType,
        });
        fetchRecommendations(workspaceId, opportunityListId);
    };

    get addOpportunitiesButtonOptions(): AddOpportunitiesButtonOption[] {
        const { openWebsitesModal, enableFindOpportunities } = this.props;
        return compact([
            {
                label: (
                    <Option
                        title="workspace.sales.add.addNew"
                        subtitle="workspace.sales.add.description"
                    />
                ),
                action: openWebsitesModal,
                key: "workspace.sales.add.addNew",
                ellipsisDropdownItemProps: { iconName: "add", className: "more_leads__item" },
            },
            enableFindOpportunities && this.getOption(),
            {
                label: (
                    <Option
                        title="workspace.recommendation_sidebar.indicator"
                        subtitle="workspace.recommendation_sidebar.indicatorDescription"
                    />
                ),
                key: "workspace.recommendation_sidebar.indicator",
                action: () => this.onClickRecommendationsIndicator(),
                ellipsisDropdownItemProps: {
                    iconName: "wand",
                    className: "more_leads__item",
                },
            },
        ]);
    }

    public render() {
        const {
            updatingList,
            isTableLoading,
            workspaceId,
            opportunityListId,
            data,
            showErrorToast,
            goToDashboardTemplate,
            lastSnapshotDate,
            onDataUpdate,
            activeList,
            onRowSelected,
            tableSearchTerm,
            impersonateMode,
            sizeOpportunityLeadsInList,
            activeSelectedRow,
        } = this.props;
        const { page, isColumnsPickerOpen, isUnlockModalOpen, unlockModalConfig } = this.state;

        const columns = this.getVisibleColumns(this.state);
        const params = queryString.stringify({
            opportunitiesListId: opportunityListId,
            workspaceId,
            date: dayjs(lastSnapshotDate).format("YYYY-MM"),
        });
        const link = this.isExcelAllowed
            ? `/widgetApi/SalesWorkspace/OpportunitiesList/Excel?${params}`
            : "";

        return (
            <TableWrapper loading={updatingList || isTableLoading}>
                <SalesTableHeader
                    tableLoading={updatingList || isTableLoading}
                    workspaceId={workspaceId}
                    activeList={activeList}
                    impersonateMode={impersonateMode}
                    lastSnapshotDate={lastSnapshotDate}
                    link={link}
                    predefinedViews={predefinedViewOptions}
                    sizeOpportunityLeadsInList={sizeOpportunityLeadsInList}
                    tableSearchTerm={tableSearchTerm}
                    selectedViewId={this.state.selectedViewId}
                    isShowedUnsubscribe={this.state.isShowedUnsubscribe}
                    countries={this.state.countries}
                    addOpportunitiesButtonOptions={this.addOpportunitiesButtonOptions}
                    isExcelAllowed={this.isExcelAllowed}
                    isFroUser={this.isFroUser}
                    clickSubscribeBtnEmailDigest={this.clickSubscribeBtnEmailDigest}
                    closeUnsubscribeEmailDigestModal={this.closeUnsubscribeEmailDigestModal}
                    editOpportunityList={this.editOpportunityList}
                    onCountryChange={this.changeCountry}
                    onExcelDownloadClick={this.onExcelDownloadClick}
                    onOpenDropdown={this.onOpenDropdown}
                    onSearch={this.onSearch}
                    onViewChange={this.handleViewChange}
                    openColumnPicker={() => this.toggleColumnsPicker(true)}
                    hasCustomView={predefinedViews.hasCustomView}
                    metricsCount={predefinedViews.metricsCount}
                    onSignalChange={this.handleSignalChange}
                    updatingList={updatingList}
                />
                <SWReactTableOptimizedWithSelection
                    tableSelectionKey={`SalesWorkspaceTable${opportunityListId}`}
                    tableSelectionProperty="site"
                    isLoading={updatingList || isTableLoading}
                    tableData={data}
                    tableColumns={columns}
                    onSort={this.onSort}
                    getStableKey={this.getStableKey}
                    tableOptions={{
                        ...getOptions(
                            workspaceId,
                            opportunityListId,
                            this.updateParams,
                            onDataUpdate,
                            goToDashboardTemplate,
                            undefined,
                            showErrorToast,
                            onRowSelected,
                        ),
                        aboveHeaderComponents: [
                            <TableSelectionComponent
                                onRemoveOpportunities={this.onRemoveOpportunities}
                                key="TableSelectionComponent"
                            />,
                        ],
                        activeSelectedRow,
                    }}
                />
                <TablePager
                    isTableLoading={updatingList || isTableLoading}
                    handlePageChange={this.onPaging}
                    page={page}
                    table={data}
                    itemsPerPage={this.itemsPerPage}
                />
                <ColumnsPickerModal
                    isOpen={isColumnsPickerOpen}
                    onCancelClick={() => this.toggleColumnsPicker(false, true)}
                    onApplyClick={this.onApplyColumnsPicker}
                    groupsData={this.tableToggleGroups}
                    columnsData={columns}
                />
                {this.isCustomMetricsLocked && (
                    <UnlockModal
                        isOpen={isUnlockModalOpen}
                        onCloseClick={() => {
                            this.setState({
                                isUnlockModalOpen: false,
                                unlockModalConfig: "",
                            });
                        }}
                        location="Hook PRO/Sales Workspace/Add or edit metrics in the table"
                        {...UnlockModalConfig()[unlockModalConfig]}
                    />
                )}
            </TableWrapper>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const { legacySalesWorkspace, impersonation } = state;

    return {
        activeList: selectActiveOpportunityList(legacySalesWorkspace),
        activeListData: legacySalesWorkspace.activeListData,
        recommendations: legacySalesWorkspace.recommendations,
        activeWorkspaceId: legacySalesWorkspace.activeWorkspaceId,
        tableSearchTerm: legacySalesWorkspace.tableSearchTerm,
        impersonateMode: impersonation.impersonateMode,
        sizeOpportunityLeadsInList: selectSizeActiveOpportunityLeadsInList(legacySalesWorkspace),
        isRecommendationOpen: legacySalesWorkspace.isRecommendationOpen,
        updatingList: selectUpdatingList(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    const actionsObject = commonActionCreators({
        api: new SalesWorkspaceApiService(),
        component: swSettings.components.SalesWorkspace,
    });
    const {
        editOpportunityList,
        updateOpportunityList,
        fetchListOpportunities,
        toggleRecommendations,
        onRowSelected,
        fetchRecommendations,
        searchTableList,
        sortTableList,
        setLoadingTable,
        subscribeEmailDigest,
        unSubscribeEmailDigest,
    } = bindActionCreators(actionsObject, dispatch);
    const fetchSignals = (workspaceId, listId, countryCode: number) =>
        dispatch(fetchSignalsForCountryThunkAction(workspaceId, listId, countryCode));
    const selectSignalsTab = (index: number) => dispatch(setSignalsActiveTabAction(index));

    return {
        fetchSignals,
        fetchRecommendations,
        fetchListOpportunities,
        editOpportunityList,
        toggleRecommendations,
        onRowSelected,
        searchTableList,
        sortTableList,
        setLoadingTable,
        subscribeEmailDigest,
        unSubscribeEmailDigest,
        changeCountry: async (workspaceId, listId, list, country) => {
            selectSignalsTab(0);
            await updateOpportunityList(workspaceId, listId, {
                ...list,
                country,
            });
            fetchSignals(workspaceId, listId, country);
            fetchListOpportunities(workspaceId, listId);
            fetchRecommendations(workspaceId, listId);
        },
    };
};

export const SalesTableContainer = connect(mapStateToProps, mapDispatchToProps)(TableContainer);
