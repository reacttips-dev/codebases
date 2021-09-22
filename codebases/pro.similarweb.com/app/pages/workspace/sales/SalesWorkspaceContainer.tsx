import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    removeLeadsGeneratorReport,
    setLeadsGeneratorReport,
} from "actions/COPY_leadGeneratorActions";
import { showErrorToast } from "actions/toast_actions";
import { IRootScopeService, IScope } from "angular";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import {
    selectDashboardTemplate,
    templateAddKeys,
    templateChangeCountry,
    templateSetInitialTitle,
    templateSetOrigin,
    templateSetParent,
} from "components/dashboard/dashboard-templates/actions/dashboardTemplateActions";
import {
    DashboardTemplateService,
    EDashboardOriginType,
    EDashboardParentType,
} from "components/dashboard/dashboard-templates/DashboardTemplateService";
import Benchmark from "components/dashboard/dashboard-templates/templates/Benchmark";
import Evaluation from "components/dashboard/dashboard-templates/templates/Evaluation";
import { ProModal } from "components/Modals/src/ProModal";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { WorkspaceContext } from "pages/workspace/common components/WorkspaceContext";
import { SalesWorkspace } from "pages/workspace/sales/src/SalesWorkspace";
import { AssetsService } from "services/AssetsService";
import { DefaultFetchService } from "services/fetchService";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import UnlockModal from "../../../../.pro-features/components/Modals/src/UnlockModal/UnlockModal";
import UnlockModalConfig from "../../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import CountryService from "../../../services/CountryService";
import SalesWorkspaceApiService, {
    LeadGeneratorSalesApi,
} from "../../../services/workspaces/salesWorkspaceApiService";
import { LeadGeneratorWizard } from "../../lead-generator/lead-generator-wizard/COPY_LeadGeneratorWizard";
import LeadGeneratorUtils from "../../lead-generator/LeadGeneratorUtils";
import { commonActionCreators } from "../common/actions_creators/COPY_common_worksapce_action_creators";
import { OVERVIEW_ID } from "../common/consts";
import { selectActiveOpportunityList, selectActiveWorkSpace } from "../common/selectors";
import { IWorkspaceContainerProps, IWorkspaceContainerState } from "../common/types";
import { shouldLockModule } from "../common/workspacesUtils";
import { findNewLeadsBox, quickLinks } from "./SalesQuickLinksConfig";
import { SalesTableContainer } from "./SalesTableContainer/SalesTableContainer";
import { SearchLeadsModal } from "./SearchLeads/SearchLeadsModal";
import { selectSavedSearchesList } from "./selectors";
import { RootState } from "store/types";

const translate = i18nFilter();
const track = allTrackers.trackEvent.bind(allTrackers);
const SearchLeadsModalCustomStyles = {
    content: {
        width: "700px",
        padding: "20px 24px 24px 24px",
    },
};

class SalesWorkspaceContainer extends PureComponent<
    IWorkspaceContainerProps,
    IWorkspaceContainerState
> {
    public swNavigator: any;
    public swSettings: any;
    public fetchService: any;
    public workspaces: any;
    public autoCompleteService: any;
    public sitesResource: any;
    private $scope: IScope;
    private readonly isSourceLeadsLocked: boolean;

    constructor(props, context) {
        super(props, context);
        this.swNavigator = Injector.get<any>("swNavigator");
        this.swSettings = swSettings;
        this.fetchService = DefaultFetchService.getInstance();
        this.autoCompleteService = Injector.get("autoCompleteService");
        this.sitesResource = Injector.get<any>("sitesResource");
        this.isSourceLeadsLocked = shouldLockModule(
            this.swSettings.components.WsSourceLeads.resources.AvaliabilityMode,
        );

        this.state = {
            isShowSearchLeadsModal: false,
            technologies: {
                categories: {},
            },
        };
    }

    public async init() {
        this.props.updateSnapshotDate();
        const workspaces = await this.props.fetchWorkspaces();
        if (!workspaces.length) {
            // no workspace created yet
            await this.props.createWorkspace();
        }
        this.$scope = Injector.get<IRootScopeService>("$rootScope").$new(true);
        this.$scope.$on("navUpdate", this.syncStateWithUrl);

        const {
            workspaceId: idInUrl,
            listId,
            searchId,
            showWizard,
            unsubscribeFromMonthlyDigest,
        } = this.swNavigator.getParams();

        const newSelectedWorkspace =
            this.props.workspaces.find(({ workspaceId }) => workspaceId === idInUrl) ||
            this.props.workspaces[0];

        const newSavedSearchList = newSelectedWorkspace?.savedSearches?.find(
            ({ queryDefinition }) => queryDefinition.id === searchId,
        );

        if (newSavedSearchList) {
            const { queryDefinition, lastRun } = newSavedSearchList;

            this.swNavigator.updateParams({
                workspaceId: newSelectedWorkspace.workspaceId,
                listId,
                searchId: queryDefinition.id,
            });

            this.props.selectActiveSearchList(queryDefinition.id, {
                // TODO
                // eslint-disable-next-line @typescript-eslint/camelcase
                order_by: queryDefinition?.order_by,
                filters: queryDefinition?.filters,
                queryId: queryDefinition?.id,
                runId: lastRun?.id,
            });

            this.toggleWebsitesWizard();
        }

        if (showWizard === "true") {
            this.swNavigator.updateParams({
                workspaceId: newSelectedWorkspace.workspaceId,
                listId,
                showWizard: null,
            });

            this.toggleWebsitesWizard();
        }

        if (unsubscribeFromMonthlyDigest === "true") {
            this.props.unsubscribeFromMonthlyDigest();
        }

        this.syncStateWithUrl();
    }
    public syncStateWithUrl = () => {
        const { workspaceId: idInUrl, listId, searchId } = this.swNavigator.getParams();

        const newSelectedWorkspace =
            this.props.workspaces.find(({ workspaceId }) => workspaceId === idInUrl) ||
            this.props.workspaces[0];

        const newSelectedList = newSelectedWorkspace.opportunityLists.find(
            ({ opportunityListId }) => opportunityListId === listId,
        ) || { opportunityListId: OVERVIEW_ID };

        const newSavedSearchList = newSelectedWorkspace.savedSearches.find(
            ({ queryDefinition }) => queryDefinition.id === searchId,
        );

        if (
            newSelectedList.opportunityListId !== this.props.activeListId ||
            newSelectedWorkspace.workspaceId !== this.props.activeWorkspace.workspaceId
        ) {
            this.props.selectWorkspace(newSelectedWorkspace.workspaceId);
            this.activateList(newSelectedList.opportunityListId, newSelectedWorkspace.workspaceId);
        }

        this.swNavigator.updateParams({
            workspaceId: newSelectedWorkspace.workspaceId,
            listId: newSelectedList.opportunityListId,
            searchId: newSavedSearchList?.queryDefinition?.id ?? null,
        });
    };

    public isEmptyWorkspace = (workspace) => {
        return !(workspace && workspace.opportunityLists && workspace.opportunityLists.length);
    };

    public fetchListOpportunities = (params = {}) => {
        this.props.fetchListOpportunities(
            this.props.activeWorkspaceId,
            this.props.activeListId,
            params,
        );
    };

    // TODO: Should be extracted to "helpers" when refactored
    getCountryNameForList(country: string): string {
        if (country !== "Worldwide") {
            return this.getCountryById(country).text;
        }

        return country;
    }

    // TODO: Should be extracted to "helpers" when refactored
    getCategoryNameForList(category: string): string {
        const categoryNameParsed = category.slice(category.indexOf("~") + 1).replace(/_/g, " ");

        if (categoryNameParsed !== "All") {
            return categoryNameParsed;
        }

        return "All categories";
    }

    // TODO: Should be extracted to "helpers" when refactored
    buildListFriendlyName(country: string, category?: string): string {
        const countryName = this.getCountryNameForList(country);

        if (typeof category === "undefined") {
            return countryName;
        }

        return `${this.getCategoryNameForList(category)} in ${countryName}`;
    }

    public onAddOpportunitiesFromWizard = async (
        opportunities,
        newListName,
        chosenCategory,
        chosenCountry,
    ) => {
        if (this.props.isWebsitesModalOpen) {
            this.toggleWebsitesModal();
        }
        let { activeListId } = this.props;
        const { activeWorkspaceId, activeOpportunitiesList } = this.props;
        const listName = this.props.activeOpportunitiesList.friendlyName;
        const friendlyName = this.buildListFriendlyName(chosenCountry, chosenCategory);

        if (typeof listName === "undefined") {
            activeListId = await this.createNewOpportunityList(newListName || friendlyName);
        }

        if (!this.isFeatureEnabled("saved-searches")) {
            this.activateList(activeListId);
        }

        await this.props.addOpportunities(
            activeWorkspaceId,
            activeListId,
            opportunities,
            false,
            this.isFeatureEnabled("saved-searches"),
        );

        if (activeOpportunitiesList?.opportunityListId || !newListName) {
            this.props.unSelectActiveSearchList();
            this.toggleWebsitesWizard();
        }
    };

    public onAddItemToExistOpportunityList = async (opportunities, opportunityListId) => {
        const { activeWorkspaceId, activeOpportunitiesList } = this.props;
        await this.props.addOpportunities(
            activeWorkspaceId,
            opportunityListId,
            opportunities,
            false,
            this.isFeatureEnabled("saved-searches"),
        );

        if (activeOpportunitiesList?.opportunityListId) {
            this.props.unSelectActiveSearchList();
            this.toggleWebsitesWizard();
        }
    };

    public async componentDidMount() {
        this.init();

        // Fetch technologies for a lead generator filter
        const api = new SalesWorkspaceApiService();
        const technologies = await api.fetchTechnologies();

        this.setState(() => ({
            technologies,
        }));
    }

    public componentWillUnmount() {
        this.props.reset();
        this.$scope.$destroy();
    }

    private isFeatureEnabled = (feature) => {
        switch (feature) {
            case "saved-searches":
                return (
                    this.swSettings?.components?.SalesWorkspace?.resources?.ShowSavedSearches ??
                    false
                );
        }
        return false;
    };

    public createWorkspaceContextObject = () => {
        return {
            ...this.props,
            onFetchRecommendations: () =>
                this.props.fetchRecommendations(
                    this.props.activeWorkspaceId,
                    this.props.activeListId,
                ),
            getCountryById: CountryService.getCountryById.bind(CountryService),
            translate: i18nFilter(),
            getTeLink: (site, country) =>
                this.swNavigator.href("websites-audienceOverview", {
                    key: site,
                    isWWW: "*",
                    country,
                    duration: "3m",
                }),
            getMcLink: (site, country) =>
                this.swNavigator.href("websites-trafficOverview", {
                    key: site,
                    isWWW: "*",
                    country,
                    duration: "3m",
                    category: "no-category",
                }),
            setFeedback: this.props.setFeedItemFeedback,
            editOpportunityList: this.props.editOpportunityList,
            getAssetsUrl: AssetsService.assetUrl.bind(AssetsService),
            isFeatureEnabled: this.isFeatureEnabled,
        };
    };

    public activateList = (listId, workspaceId = this.props.activeWorkspaceId) => {
        this.props.selectActiveList(listId);
        if (listId !== OVERVIEW_ID) {
            this.props.fetchListOpportunities(workspaceId, listId, {});
            this.props.fetchRecommendations(workspaceId, listId);
        }
        this.props.toggleRightBar(false);
    };

    public onClickFindNewLeadsBox = () => {
        const { searchLeadBoxTableData } = this.props;

        if (searchLeadBoxTableData && searchLeadBoxTableData?.Records.length) {
            this.setState({ isShowSearchLeadsModal: true });
            TrackWithGuidService.trackWithGuid(
                "workspaces.sales.home_page.saved_searches.open_saved_searches.pop_up",
                "click",
                {},
            );
        } else {
            this.openWizardFromEmptyList(OVERVIEW_ID);
        }
    };

    public onFindNewLeadFromModal = () => {
        const { listId } = this.swNavigator.getParams();

        this.setState({ isShowSearchLeadsModal: false });
        this.openWizardFromEmptyList(listId || OVERVIEW_ID);

        TrackWithGuidService.trackWithGuid(
            "workspaces.sales.home_page.saved_searches.open.pop_up.define_new_search",
            "click",
            {
                savedSearchesUserHave: this.props.searchLeadBoxTableData.TotalCount || "0", // TODO must use the string "0" if you have an int 0 value
            },
        );
    };

    public onCancelSearchLeadsModal = () => {
        this.setState({ isShowSearchLeadsModal: false });

        TrackWithGuidService.trackWithGuid(
            "workspaces.sales.home_page.saved_searches.open.pop_up.close",
            "click",
            {
                savedSearchesUserHave: this.props.searchLeadBoxTableData.TotalCount || "0", // TODO must use the string "0" if you have an int 0 value
            },
        );
    };

    public onClickByRowSearchLeadsModalTable = (event, rowData) => {
        this.setState({ isShowSearchLeadsModal: false });
        this.props.selectActiveSearchList(rowData.queryDefinitionId, rowData.queryParams);
        this.toggleWebsitesWizard();

        TrackWithGuidService.trackWithGuid(
            "workspaces.sales.homepage.saved_searches.pop_up.clicks_on_row",
            "click",
            {
                savedSearchesUserHave: this.props.searchLeadBoxTableData.TotalCount || "0", // TODO must use the string "0" if you have an int 0 value
                newResults: rowData.newResults || "0", // TODO must use the string "0" if you have an int 0 value
            },
        );
    };

    private shouldEnableFindOpportunities() {
        const leadGeneratorCountries = LeadGeneratorUtils.getComponentCountries();
        return !!leadGeneratorCountries.find(
            (country) => country.id === this.props.activeOpportunitiesList.country,
        );
    }

    private checkIsGeneratorLocked = async () => {
        try {
            const { total, used } = await this.fetchService.get(
                "api/grow-reports-management/quota",
                undefined,
                {
                    preventAutoCancellation: true,
                },
            );
            return total <= used;
        } catch (e) {
            return false;
        }
    };

    private createNewListForGenerator = () => {
        this.activateList(OVERVIEW_ID);

        allTrackers.trackEvent(
            "Internal Link",
            "click",
            "From home page/Find and Source Companies",
        );

        this.toggleWebsitesWizard();
    };

    private createNewOpportunityList = async (
        listName,
        workspaceId = this.props.activeWorkspaceId,
    ) => {
        const { opportunityListId } = await this.props.createOpportunitiesList(
            listName,
            workspaceId,
        );
        return opportunityListId;
    };

    private addOpportunities = async (opportunities, listName) => {
        const ListId =
            this.props.activeListId !== "overview"
                ? this.props.activeListId
                : (await this.props.createOpportunitiesList(listName, this.props.activeWorkspaceId))
                      .opportunityListId;
        const country = this.props.activeOpportunitiesList.country;
        this.activateList(ListId);

        if (this.props.activeOpportunitiesList.friendlyName !== listName) {
            const friendlyName = listName;
            await this.props.updateOpportunityList(
                this.props.activeWorkspaceId,
                this.props.activeListId,
                { friendlyName, country },
            );
        }

        await this.props.addOpportunities(
            this.props.activeWorkspaceId,
            ListId,
            opportunities,
            false,
            this.isFeatureEnabled("saved-searches"),
        );

        if (this.props.isWebsitesModalOpen) {
            this.toggleWebsitesModal();
        }

        this.props.unSelectActiveSearchList();
    };

    private isEmptyList = (list) => {
        return list && list.opportunities && !!list.opportunities.length;
    };

    private onCreateNewList = () => {
        if (this.isFeatureEnabled("saved-searches")) {
            TrackWithGuidService.trackWithGuid(
                "workspaces.sales.homepage.empty_workspace.add_inbound_leads",
                "click",
                {},
            );
        }

        this.toggleWebsitesModal();
    };

    private toggleWebsitesModal = () => {
        const isEmptyState =
            !this.props.isTableLoading &&
            !this.isEmptyList(this.props.activeOpportunitiesList) &&
            !this.props.isError;

        allTrackers.trackEvent(
            "Websites Modal",
            !this.props.isWebsitesModalOpen ? "open" : "close",
            `Create and add companies${isEmptyState ? "/empty state" : ""}`,
        );
        this.props.toggleWebsitesModal();
    };

    private closeWebsitesModal = (opportunities) => {
        allTrackers.trackEvent("Websites Modal", "close", "Add opportunities");
        if (opportunities === 0) {
            this.activateList(OVERVIEW_ID);
        }
        this.props.toggleWebsitesModal();
    };

    private onExitWebsiteWizard = async (opportunities) => {
        if (opportunities === 0) {
            this.activateList(OVERVIEW_ID);
            this.props.unSelectActiveSearchList();
        }
        this.toggleWebsitesWizard();
    };

    private getCountryById = (id) => CountryService.getCountryById(id);

    private openModalFromEmptyList = (listID) => {
        this.activateList(listID);
        this.toggleWebsitesModal();
    };

    private openWizardFromEmptyList = (listID) => {
        this.activateList(listID);
        this.toggleWebsitesWizard();
    };

    private toggleWebsitesWizard = (calledFromOutside?) => {
        if (this.isSourceLeadsLocked) {
            this.props.toggleUnlockModal(true);

            return;
        }

        this.props.toggleWebsitesWizard(!this.props.isWebsitesWizardOpen);
    };

    private onFindNewLeadsFromList = () => {
        const { searchLeadBoxTableData } = this.props;
        if (searchLeadBoxTableData && searchLeadBoxTableData?.Records.length) {
            this.setState({ isShowSearchLeadsModal: true });
        } else {
            this.toggleWebsitesWizard();
        }
    };

    private addRecommendations = async (recommendations, holdRightBarOpen) => {
        await this.props.addRecommendations(
            this.props.activeWorkspaceId,
            this.props.activeListId,
            recommendations,
            holdRightBarOpen,
        );
    };

    private dismissRecommendation = (recommendation) => {
        this.props.dismissRecommendation(
            this.props.activeWorkspaceId,
            this.props.activeListId,
            recommendation,
        );
    };

    private linkRecommendation = (recommendation) => {
        this.swNavigator.go("websites-worldwideOverview", {
            key: recommendation,
            country: this.props.activeOpportunitiesList.country,
            duration: "1m",
            isWWW: "*",
            webSource: "Total",
        });
    };

    public render() {
        const { technologies } = this.state;
        if (!this.props.activeWorkspaceId) return null;

        const { opportunities = [] } = this.props.activeOpportunitiesList || {};
        const enableFindOpportunities = this.shouldEnableFindOpportunities();

        if (this.props.isWebsitesWizardOpen) {
            return (
                <WorkspaceContext.Provider value={this.createWorkspaceContextObject()}>
                    <div className="sw-layout-scrollable-element use-sticky-css-rendering fadeIn">
                        <LeadGeneratorWizard
                            technologies={technologies}
                            activeWorkspace={this.props.activeWorkspaceId}
                            activeOpportunitiesList={this.props.activeOpportunitiesList}
                            workspaceApi={LeadGeneratorSalesApi}
                            setLeadsGeneratorReport={this.props.onSetLeadsGeneratorReport}
                            removeLeadsGeneratorReport={this.props.onRemoveLeadsGeneratorReport}
                            onAddOpportunities={this.onAddOpportunitiesFromWizard}
                            onAddItemToExistOpportunityList={this.onAddItemToExistOpportunityList}
                            initialKeys={opportunities}
                            closeWizard={this.onExitWebsiteWizard}
                            deleteOpportunityList={this.props.deleteOpportunityList}
                            workspaceType="sales"
                            activeSavedSearchFilterData={this.props.activeSavedSearchFilterData}
                            clearSavedSearchFilterData={this.props.unSelectActiveSearchList}
                        />
                    </div>
                </WorkspaceContext.Provider>
            );
        }

        return (
            <WorkspaceContext.Provider value={this.createWorkspaceContextObject()}>
                <FlexColumn style={{ height: "100%" }}>
                    <SalesWorkspace
                        editOpportunity={this.props.editOpportunityList}
                        error={this.props.isError}
                        onCreateNewList={this.onCreateNewList}
                        createNewListForGenerator={this.createNewListForGenerator}
                        isEmptyWorkspace={this.isEmptyWorkspace(this.props.activeWorkspace)}
                        isTableLoading={this.props.isTableLoading}
                        workspaceId={this.props.activeWorkspaceId}
                        workspaceName={this.props.activeWorkspace.name}
                        enableFindOpportunities={enableFindOpportunities}
                        onSelectList={this.activateList}
                        activeSelectedRow={true}
                        isOverviewPage={this.props.activeListId === OVERVIEW_ID}
                        opportunityListId={this.props.activeListId}
                        data={this.props.activeListData}
                        opportunities={opportunities}
                        lastSnapshotDate={this.props.lastSnapshotDate}
                        translate={translate}
                        track={track}
                        getLink={this.swNavigator.href.bind(this.swNavigator)}
                        onFilter={this.fetchListOpportunities}
                        onRemoveOpportunities={this.props.removeOpportunities}
                        onDataUpdate={this.fetchListOpportunities}
                        components={{ SalesTableContainer, WebsiteTooltip }}
                        quickLinkData={{
                            quickLinks,
                            findNewLeadsBox,
                            onClickFindNewLeadsBox: this.onClickFindNewLeadsBox,
                            linkToDashboardTemplate: this.props.goToDashboardTemplateNoList,
                            dashboardTemplates: {
                                benchmark: Benchmark.id,
                                industryAnalysis: Evaluation.id,
                            },
                            workspace: this.props.activeWorkspace.name,
                        }}
                        emptyWorkspaceProps={{
                            onFindClick: this.toggleWebsitesWizard,
                            onUploadClick: this.toggleWebsitesModal,
                        }}
                        openWebsitesModal={this.toggleWebsitesModal}
                        onFindWebsites={this.onFindNewLeadsFromList}
                        modalProps={{
                            isOpen: this.props.isWebsitesModalOpen,
                            initialKeys: opportunities,
                            placeholder: "Enter / paste one or more websites",
                            modalPlaceholder: "workspace.sales.websites.modal.listplaceholder",
                            onSave: this.addOpportunities,
                            onCloseClick: this.closeWebsitesModal,
                            onCancelClick: this.closeWebsitesModal,
                            autoCompleteService: this.autoCompleteService,
                            sitesResource: this.sitesResource,
                            listName:
                                this.props.activeListId !== "overview"
                                    ? this.props.activeOpportunitiesList.friendlyName
                                    : "",
                            activeListId: this.props.activeListId,
                        }}
                        goToDashboardTemplate={this.props.goToDashboardTemplate}
                        showErrorToast={this.props.showErrorToast}
                        onAddFromModal={this.openModalFromEmptyList}
                        onAddFromWizard={this.openWizardFromEmptyList}
                        isGeneratorLimited={
                            this.swSettings.components.SalesWorkspace.resources
                                .LeadGeneratorNumberOfQueriesLimit
                        }
                        checkIsGeneratorLocked={this.checkIsGeneratorLocked}
                        recommendations={this.props.recommendations}
                        onAddRecommendations={this.addRecommendations}
                        onDismissRecommendation={this.dismissRecommendation}
                        onLinkRecommendation={this.linkRecommendation}
                        isRecommendationsLoading={this.props.isRecommendationsLoading}
                        isRecommendationOpen={this.props.isRecommendationOpen}
                        toggleRecommendations={this.props.toggleRecommendations}
                    />
                </FlexColumn>
                {this.isSourceLeadsLocked && (
                    <UnlockModal
                        isOpen={this.props.isUnlockModalOpen}
                        onCloseClick={() => {
                            this.props.toggleUnlockModal(false);
                        }}
                        location="Hook PRO/Sales Workspace/Find new leads"
                        {...UnlockModalConfig().SourceOpportunities}
                    />
                )}
                <ProModal
                    customStyles={SearchLeadsModalCustomStyles}
                    showCloseIcon={false}
                    isOpen={this.state.isShowSearchLeadsModal}
                >
                    <SearchLeadsModal
                        data={this.props.searchLeadBoxTableData}
                        onClickCancel={this.onCancelSearchLeadsModal}
                        onRowSelected={this.onClickByRowSearchLeadsModalTable}
                        onClickDone={this.onFindNewLeadFromModal}
                    />
                </ProModal>
            </WorkspaceContext.Provider>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    const api = new SalesWorkspaceApiService();
    const actionsObject = commonActionCreators({
        api,
        component: swSettings.components.SalesWorkspace,
    });
    const {
        selectActiveWorkspace,
        updateSnapshotDate,
        selectActiveList,
        selectActiveSearchList,
        unSelectActiveSearchList,
        fetchWorkspaces,
        fetchListOpportunities,
        removeOpportunities,
        createWorkspace,
        createOpportunitiesList,
        addOpportunities,
        fetchRecommendations,
        dismissRecommendation,
        addRecommendations,
        setFeedItemFeedback,
        toggleWebsitesWizard,
        toggleWebsitesModal,
        toggleUnlockModal,
        editOpportunityList,
        reset,
        toggleRightBar,
        updateOpportunityList,
        deleteOpportunityList,
        unsubscribeFromMonthlyDigest,
        toggleRecommendations,
    } = bindActionCreators(actionsObject, dispatch);

    return {
        fetchWorkspaces,
        updateSnapshotDate,
        fetchListOpportunities,
        removeOpportunities,
        createWorkspace,
        selectWorkspace: selectActiveWorkspace,
        selectActiveList,
        selectActiveSearchList,
        unSelectActiveSearchList,
        createOpportunitiesList,
        addOpportunities,
        unsubscribeFromMonthlyDigest,
        showErrorToast: (text: string) => dispatch(showErrorToast(text)),
        fetchRecommendations,
        dismissRecommendation,
        addRecommendations,
        setFeedItemFeedback,
        toggleWebsitesWizard,
        toggleWebsitesModal,
        toggleUnlockModal,
        editOpportunityList,
        reset,
        updateOpportunityList,
        deleteOpportunityList,
        toggleRecommendations,
        toggleRightBar,
        goToDashboardTemplate: async (
            templateId,
            keys,
            country,
            // TODO
            // eslint-disable-next-line @typescript-eslint/camelcase
            opportunityListId_opportunityId,
            templateTitle,
        ) => {
            dispatch(templateAddKeys(keys));
            dispatch(templateChangeCountry(country));
            dispatch(selectDashboardTemplate(templateId));
            dispatch(
                templateSetOrigin(
                    EDashboardOriginType.SALES_WORKSPACE,
                    opportunityListId_opportunityId,
                ),
            );
            dispatch(templateSetParent(EDashboardParentType.TEMPLATE, templateId));
            dispatch(templateSetInitialTitle(templateTitle));
            await DashboardTemplateService.generateDashboardTemplates();
            Injector.get<any>("swNavigator").go("dashboard-gallery", {});
        },
        goToDashboardTemplateNoList: async (templateId) => {
            dispatch(selectDashboardTemplate(templateId));
            dispatch(templateSetParent(EDashboardParentType.TEMPLATE, templateId));
            await DashboardTemplateService.generateDashboardTemplates();
            Injector.get<any>("swNavigator").go("dashboard-gallery", {});
        },
        fetchTechnologies: api.fetchTechnologies,
        onSetLeadsGeneratorReport: (queryId, runId) => {
            dispatch(setLeadsGeneratorReport(queryId, runId));
        },
        onRemoveLeadsGeneratorReport: () => {
            dispatch(removeLeadsGeneratorReport());
        },
    };
};
const mapStateToProps = (state: RootState) => {
    const { legacySalesWorkspace } = state;
    return {
        ...legacySalesWorkspace,
        searchLeadBoxTableData: selectSavedSearchesList(),
        activeWorkspace: selectActiveWorkSpace(legacySalesWorkspace),
        active: selectActiveWorkSpace(legacySalesWorkspace),
        activeSavedSearchFilterData: legacySalesWorkspace.activeSavedSearchFilterData,
        activeOpportunitiesList: selectActiveOpportunityList(legacySalesWorkspace) || {},
        isWebsitesWizardOpen: legacySalesWorkspace.isWebsitesWizardOpen,
        isWebsitesModalOpen: legacySalesWorkspace.isWebsitesModalOpen,
        isUnlockModalOpen: legacySalesWorkspace.isUnlockModalOpen,
    };
};
SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(SalesWorkspaceContainer),
    "SalesWorkspaceContainer",
);
