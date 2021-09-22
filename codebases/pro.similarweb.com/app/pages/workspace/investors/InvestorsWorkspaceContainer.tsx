import { removeLeadsGeneratorReport, setLeadsGeneratorReport } from "actions/leadGeneratorActions";
import { IRootScopeService, IScope } from "angular";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import Benchmark from "components/dashboard/dashboard-templates/templates/Benchmark";
import Evaluation from "components/dashboard/dashboard-templates/templates/Evaluation";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { PureComponent } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { allTrackers } from "services/track/track";
import UnlockModal from "../../../../.pro-features/components/Modals/src/UnlockModal/UnlockModal";
import UnlockModalConfig from "../../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import { WorkspaceContext } from "../../../../.pro-features/pages/workspace/common components/WorkspaceContext";
import { InvestorsWorkspace } from "../../../../.pro-features/pages/workspace/investors/src/InvestorsWorkspace";
import { FlexColumn } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { showErrorToast } from "../../../actions/toast_actions";
import {
    selectDashboardTemplate,
    templateAddKeys,
    templateChangeCountry,
    templateSetInitialTitle,
    templateSetOrigin,
    templateSetParent,
} from "../../../components/dashboard/dashboard-templates/actions/dashboardTemplateActions";
import {
    DashboardTemplateService,
    EDashboardOriginType,
    EDashboardParentType,
} from "../../../components/dashboard/dashboard-templates/DashboardTemplateService";
import { WebsiteTooltip } from "../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { AssetsService } from "../../../services/AssetsService";
import CountryService from "../../../services/CountryService";
import { DefaultFetchService } from "../../../services/fetchService";
import InvestorsWorkspaceApiService, {
    LeadGeneratorInvestorsApi,
} from "../../../services/workspaces/investorsWorkspaceApiService";
import { LeadGeneratorWizard } from "../../lead-generator/lead-generator-wizard/LeadGeneratorWizard";
import LeadGeneratorUtils from "../../lead-generator/LeadGeneratorUtils";
import { commonActionCreators } from "../common/actions_creators/common_worksapce_action_creators";
import { LIST_SETTING_FEED, OVERVIEW_ID } from "../common/consts";
import { selectActiveOpportunityList, selectActiveWorkSpace } from "../common/selectors";
import { IWorkspaceContainerProps, IWorkspaceContainerState } from "../common/types";
import { shouldLockModule } from "../common/workspacesUtils";
import { extensionLinks, quickLinks } from "./InvestorsQuickLinksConfig";
import { InvestorsTableContainer } from "./InvestorsTableContainer/InvestoresTableContainer";

const translate = i18nFilter();
const track = allTrackers.trackEvent.bind(allTrackers);

class InvestorsWorkspaceContainer extends PureComponent<
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
            technologies: {
                categories: {},
            },
        };
    }

    public async init() {
        this.props.setUnsupportedFeatures(new Set([LIST_SETTING_FEED]));
        this.props.updateSnapshotDate();
        const workspaces = await this.props.fetchWorkspaces();
        if (!workspaces.length) {
            // no workspace created yet
            await this.props.createWorkspace();
        }
        this.$scope = Injector.get<IRootScopeService>("$rootScope").$new(true);
        this.$scope.$on("navUpdate", this.syncStateWithUrl);
        this.syncStateWithUrl();
    }

    public syncStateWithUrl = () => {
        const { workspaceId: idInUrl, listId } = this.swNavigator.getParams();
        const newSelectedWorkspace =
            this.props.workspaces.find(({ workspaceId }) => workspaceId === idInUrl) ||
            this.props.workspaces[0];
        const newSelectedList = newSelectedWorkspace.opportunityLists.find(
            ({ opportunityListId }) => opportunityListId === listId,
        ) || { opportunityListId: OVERVIEW_ID };
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

    getCountryNameForList(country: string): string {
        if (country !== "Worldwide") {
            return this.getCountryById(country).text;
        }

        return country;
    }

    getCategoryNameForList(category: string): string {
        const categoryNameParsed = category.slice(category.indexOf("~") + 1).replace(/_/g, " ");

        if (categoryNameParsed !== "All") {
            return categoryNameParsed;
        }

        return "All categories";
    }

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
        const listName = activeOpportunitiesList.friendlyName;
        const friendlyName = this.buildListFriendlyName(chosenCountry, chosenCategory);

        if (typeof listName === "undefined") {
            activeListId = await this.createNewOpportunityList(newListName || friendlyName);
        }

        this.activateList(activeListId);

        await this.props.addOpportunities(activeWorkspaceId, activeListId, opportunities);

        this.toggleWebsitesWizard();
    };

    public async componentDidMount() {
        this.init();

        // Fetch technologies for a lead generator filter
        const api = new InvestorsWorkspaceApiService();
        const technologies = await api.fetchTechnologies();

        this.setState(() => ({
            technologies,
        }));
    }

    public componentWillUnmount() {
        this.props.reset();
        this.$scope.$destroy();
    }

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
            isFeatureEnabled: (feature) => false,
        };
    };

    public render() {
        const { technologies } = this.state;
        const { opportunities = [] } = this.props.activeOpportunitiesList || {};
        if (!this.props.activeWorkspaceId) {
            return null;
        }
        const enableFindOpportunities = this.shouldEnableFindOpportunities();

        if (this.props.isWebsitesWizardOpen) {
            return (
                <WorkspaceContext.Provider value={this.createWorkspaceContextObject()}>
                    <div className="sw-layout-scrollable-element use-sticky-css-rendering fadeIn">
                        <LeadGeneratorWizard
                            technologies={technologies}
                            activeWorkspace={this.props.activeWorkspaceId}
                            activeOpportunitiesList={this.props.activeOpportunitiesList}
                            workspaceApi={LeadGeneratorInvestorsApi}
                            setLeadsGeneratorReport={this.props.onSetLeadsGeneratorReport}
                            removeLeadsGeneratorReport={this.props.onRemoveLeadsGeneratorReport}
                            onAddOpportunities={this.onAddOpportunitiesFromWizard}
                            initialKeys={opportunities}
                            closeWizard={this.onExitWebsiteWizard}
                            deleteOpportunityList={this.props.deleteOpportunityList}
                            workspaceType={"investors"}
                        />
                    </div>
                </WorkspaceContext.Provider>
            );
        }

        return (
            <WorkspaceContext.Provider value={this.createWorkspaceContextObject()}>
                <FlexColumn style={{ height: "100%" }}>
                    <InvestorsWorkspace
                        editOpportunity={this.props.editOpportunityList}
                        error={this.props.isError}
                        onCreateNewList={this.toggleWebsitesModal}
                        createNewListForGenerator={this.createNewListForGenerator}
                        isEmptyWorkspace={this.isEmptyWorkspace(this.props.activeWorkspace)}
                        isTableLoading={this.props.isTableLoading}
                        workspaceId={this.props.activeWorkspaceId}
                        workspaceName={this.props.activeWorkspace.name}
                        enableFindOpportunities={enableFindOpportunities}
                        onSelectList={this.activateList}
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
                        components={{ InvestorsTableContainer, WebsiteTooltip }}
                        quickLinkData={{
                            quickLinks,
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
                        onFindWebsites={this.toggleWebsitesWizard}
                        modalProps={{
                            isOpen: this.props.isWebsitesModalOpen,
                            modalPlaceholder: "workspace.investors.websites.modal.listplaceholder",
                            initialKeys: opportunities,
                            placeholder: "Enter / paste one or more websites",
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
                        recommendations={this.props.recommendations}
                        onAddRecommendations={this.addRecommendations}
                        onDismissRecommendation={this.dismissRecommendation}
                        onLinkRecommendation={this.linkRecommendation}
                        isRecommendationsLoading={this.props.isRecommendationsLoading}
                        isRightBarOpen={this.props.isRightBarOpen}
                        isRecommendationOpen={this.props.isRecommendationOpen}
                        toggleRightBar={this.props.toggleRightBar}
                        onAddFromModal={this.openModalFromEmptyList}
                        onAddFromWizard={this.openWizardFromEmptyList}
                    />
                </FlexColumn>
                {this.isSourceLeadsLocked && (
                    <UnlockModal
                        isOpen={this.props.isUnlockModalOpen}
                        onCloseClick={() => {
                            this.props.toggleUnlockModal(false);
                        }}
                        location={"Hook PRO/Investors Workspace/Find new companies"}
                        {...UnlockModalConfig().SourceOpportunities}
                    />
                )}
            </WorkspaceContext.Provider>
        );
    }

    public activateList = (listId, workspaceId = this.props.activeWorkspaceId) => {
        this.props.selectActiveList(listId);
        if (listId !== OVERVIEW_ID) {
            this.props.fetchListOpportunities(workspaceId, listId, {});
            this.props.fetchRecommendations(workspaceId, listId);
        }
        this.props.toggleRightBar(false);
    };

    private shouldEnableFindOpportunities() {
        const leadGeneratorCountries = LeadGeneratorUtils.getComponentCountries();
        return !!leadGeneratorCountries.find(
            (country) => country.id === this.props.activeOpportunitiesList.country,
        );
    }

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
        await this.props.addOpportunities(this.props.activeWorkspaceId, ListId, opportunities);
        if (this.props.isWebsitesModalOpen) {
            this.toggleWebsitesModal();
        }
    };
    private getCountryById = (id) => CountryService.getCountryById(id);
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

    private isEmptyList = (list) => {
        return list && list.opportunities && !!list.opportunities.length;
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
        if (this.props.activeOpportunitiesList.friendlyName === "listName") {
            await this.props.deleteOpportunityList(
                this.props.activeWorkspaceId,
                this.props.activeListId,
            );
            this.activateList(OVERVIEW_ID);
        }
        if (opportunities === 0) {
            this.activateList(OVERVIEW_ID);
        }
        this.toggleWebsitesWizard();
    };
    private createNewListForGenerator = async () => {
        this.activateList(OVERVIEW_ID);
        this.toggleWebsitesWizard();
    };

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

        if (!calledFromOutside) {
            allTrackers.trackEvent(
                "Add companies",
                "click",
                "From home page/Find and Source Companies",
            );
        }
        this.props.toggleWebsitesWizard(!this.props.isWebsitesWizardOpen);
    };
}

const mapDispatchToProps = (dispatch) => {
    const api = new InvestorsWorkspaceApiService();
    const actionsObject = commonActionCreators({
        api,
        component: swSettings.components.InvestorsWorkspace,
    });
    const {
        toggleUnlockModal,
        toggleWebsitesWizard,
        toggleWebsitesModal,
        selectActiveWorkspace,
        updateSnapshotDate,
        selectActiveList,
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
        toggleRightBar,
        editOpportunityList,
        reset,
        setUnsupportedFeatures,
        updateOpportunityList,
        deleteOpportunityList,
    } = bindActionCreators(actionsObject, dispatch);

    return {
        toggleUnlockModal,
        toggleWebsitesWizard,
        toggleWebsitesModal,
        fetchWorkspaces,
        updateSnapshotDate,
        fetchListOpportunities,
        removeOpportunities,
        createWorkspace,
        selectWorkspace: selectActiveWorkspace,
        selectActiveList,
        createOpportunitiesList,
        addOpportunities,
        showErrorToast: (text: string) => dispatch(showErrorToast(text)),
        fetchRecommendations,
        dismissRecommendation,
        addRecommendations,
        setFeedItemFeedback,
        toggleRightBar,
        editOpportunityList,
        reset,
        setUnsupportedFeatures,
        updateOpportunityList,
        deleteOpportunityList,
        goToDashboardTemplate: async (
            templateId,
            keys,
            country,
            opportunityListId_opportunityId,
            templateTitle,
        ) => {
            dispatch(templateAddKeys(keys));
            dispatch(templateChangeCountry(country));
            dispatch(selectDashboardTemplate(templateId));
            dispatch(
                templateSetOrigin(
                    EDashboardOriginType.INVESTORS_WORKSPACE,
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
const mapStateToProps = (state) => {
    const { commonWorkspace } = state;
    return {
        ...commonWorkspace,
        activeWorkspace: selectActiveWorkSpace(commonWorkspace),
        activeOpportunitiesList: selectActiveOpportunityList(commonWorkspace) || {},
        isWebsitesModalOpen: commonWorkspace.isWebsitesModalOpen,
        isWebsitesWizardOpen: commonWorkspace.isWebsitesWizardOpen,
        isUnlockModalOpen: commonWorkspace.isUnlockModalOpen,
    };
};
SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(InvestorsWorkspaceContainer),
    "InvestorsWorkspaceContainer",
);
