import swLog from "@similarweb/sw-log";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { emptyTopBar, hideTopNav, populateTopBar, showTopNav } from "actions/commonActions";
import * as utils from "components/filters-bar/utils";
import TrialBanner from "components/React/TrialBanner/TrialBanner";
import { HELP_ARTICLE_IDS } from "help-widget/constants";
import { WithHelpWidgetArticle } from "help-widget/react/WithHelpWidgetArticle";
import {
    SubscribeToArenaEdit,
    SubscribeToArenaSummary,
} from "pages/workspace/marketing/shared/styledComponents";
import React, { Component } from "react";
import { connect } from "react-redux";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import UIComponentStateService from "services/UIComponentStateService";
import { getWebSource } from "services/Workspaces.service";
import TranslationProvider from "../../../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { saveState } from "../../../../../.pro-features/components/Workspace/Sidenav/src/WorkspaceSideNavUtils";
import { OnboardingWizard } from "../../../../../.pro-features/components/Workspace/Wizard/src/OnboardingWizard";
import { ChooseMySite } from "../../../../../.pro-features/components/Workspace/Wizard/src/steps/ChooseMySite";
import { createWizardStep } from "../../../../../.pro-features/components/Workspace/Wizard/src/steps/createStep";
import { EditArena } from "../../../../../.pro-features/components/Workspace/Wizard/src/steps/EditArena";
import { SelectCompetitors } from "../../../../../.pro-features/components/Workspace/Wizard/src/steps/SelectCompetitors";
import { Summary } from "../../../../../.pro-features/components/Workspace/Wizard/src/steps/Summary";
import { WelcomeStep } from "../../../../../.pro-features/components/Workspace/Wizard/src/steps/WelcomeStep";
import {
    ISimilarSite,
    ISite,
} from "../../../../../.pro-features/components/Workspace/Wizard/src/types";
import { contextTypes } from "../../../../../.pro-features/components/Workspace/Wizard/src/WithContext";
import { Wizard } from "../../../../../.pro-features/components/Workspace/Wizard/src/Wizard";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../../scripts/common/services/swNavigator";
import { swSettings } from "../../../../../scripts/common/services/swSettings";
import { marketingWorkspaceSetAllParams } from "../../../../actions/marketingWorkspaceActions";
import SWReactRootComponent from "../../../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../../../filters/ngFilters";
import { DefaultFetchService } from "../../../../services/fetchService";
import {
    IArena,
    marketingWorkspaceApiService,
} from "../../../../services/marketingWorkspaceApiService";
import { allTrackers } from "../../../../services/track/track";
import TrialService from "../../../../services/TrialService";
import { marketingWorkspaceGo } from "../MarketingWorkspaceCtrl";
import { PreferencesService } from "services/preferences/preferencesService";

export const SIDENAV_KEY = "marketing";

declare const similarweb: any;

const ONBOARD_ARENA_CREATED = "onboardArenaCreated";

interface IMarketingWizardProps {
    workspaceId?: string;
    arenaId?: string;
    arena: IArena;
    marketingWorkspaceSetAllParams: (params) => void;
    hideTopNav: VoidFunction;
    showTopNav: VoidFunction;
    emptyTopBar: VoidFunction;
    populateTopBar: VoidFunction;
    isLastArena: boolean;
    nextArenaId?: string;
    hasMultipleWorkspaces?: boolean;
}

class MarketingWizard extends React.PureComponent<IMarketingWizardProps, any> {
    public static defaultProps = {
        selectedSite: null,
        competitors: [],
    };
    private onboardArenaCreated: boolean;
    private isTrial: boolean;
    private isTrialExpired: boolean;
    private isOnboarding: boolean;
    private progress: boolean = false;
    private isRenderingNewArena: boolean;

    constructor(props, context) {
        super(props, context);
        const countries = utils.getCountries();

        this.state = {
            selectedSite: props.selectedSite,
            competitors: props.competitors,
            similarSites: [],
            selectedCountry: this.props.arenaId
                ? countries.find((country) => country.id === this.props.arena.country)
                : countries[0],
            isLoading: false,
            subscribedToArena: marketingWorkspaceApiService.isSubscriptionOn(props.arena),
            isDeletingArena: false,
        };
        const trialService = new TrialService();
        this.isTrial = trialService.isTrial();
        this.isTrialExpired = trialService.isTrialExpired();
        this.onboardArenaCreated = PreferencesService.get(`${ONBOARD_ARENA_CREATED}`) || false;
        this.isOnboarding = this.isTrial && !this.isTrialExpired && !this.onboardArenaCreated;
        this.isRenderingNewArena = !!this.props.workspaceId && !this.props.arenaId;
        if (this.isOnboarding || this.isRenderingNewArena) {
            this.props.emptyTopBar();
        }
    }

    public onSelectMainSite = (selectedSite) => {
        allTrackers.trackEvent(
            "wizard",
            "click",
            `marketing wizard/select main site/${selectedSite.name}`,
        );
        this.setCompetitors(selectedSite);

        this.setState({
            selectedSite,
        });

        if (this.isTrial) {
            this.isSmallSite(selectedSite.name).then((isBlackList) => {
                this.setState({
                    selectedSite: { ...selectedSite, isBlackList },
                });
            });
        }
    };

    public onSelectMainSiteOnboarding = (selectedSite) => {
        allTrackers.trackEvent(
            "wizard",
            "click",
            `marketing wizard/select main site/${selectedSite.name}`,
        );
        this.fetchSimilarSites(selectedSite);
        this.setState({
            selectedSite,
            competitors: [],
        });
    };

    public setCompetitors = (selectedSite) => {
        this.fetchSimilarSites(selectedSite);
        const newCompetitors = this.state.competitors.reduce((result, competitor) => {
            if (competitor.name === selectedSite.name) {
                return result;
            } else {
                return [...result, { ...competitor }];
            }
        }, []);
        this.setState({
            competitors: newCompetitors,
        });
    };

    public onClearMainSite = () => {
        const { name } = this.state.selectedSite;
        allTrackers.trackEvent("wizard", "click", `marketing wizard/clear main site/${name}`);
        this.setState({
            selectedSite: null,
        });
    };

    public fetchSimilarSites = async ({ name }) => {
        const fetchService = DefaultFetchService.getInstance();
        const items = await fetchService.get<ISimilarSite[]>(
            `/api/websiteanalysis/getsimilarsites?key=${name}&limit=20`,
        );
        this.setState(() => ({
            similarSites: items.map(({ Domain: name, Favicon: icon, Rank }) => ({
                name,
                icon,
                Rank,
            })),
        }));
    };

    public getAutoCompleteSuggestions = async (query) => {
        const fetchService = DefaultFetchService.getInstance();
        const { selectedSite } = this.state;

        if (query) {
            let items = await fetchService.get<ISite[]>(
                `/autocomplete/websites?size=9&term=${query}&webSource=Desktop&country=${this.state.selectedCountry.id}&validate=true`,
            );
            if (selectedSite) {
                // remove selected site from the autocomplete results
                items = items.filter(({ name }) => name !== selectedSite.name);
            }
            return items;
        }
        return [];
    };

    public getSuggestions = () => {
        const { similarSites } = this.state;
        return {
            title: i18nFilter()("workspaces.marketing.wizard.add_competitors.similarsites"),
            items: similarSites,
        };
    };

    public getOnboardingSuggestions = () => {
        const { similarSites } = this.state;
        return {
            title: i18nFilter()("workspace.marketing.onboarding.similarsites"),
            items: similarSites,
        };
    };

    public onCompetitorsUpdate = (competitor) => {
        const lastCompetitor = competitor[competitor.length - 1];
        if (competitor.length > 0 && !lastCompetitor.ignoreSmallSite) {
            this.isSmallSite(lastCompetitor.name).then((isBlackList) => {
                lastCompetitor.isBlackList = isBlackList;
                lastCompetitor.ignoreSmallSite = false;
                this.setState({
                    competitors: competitor,
                });
            });
        } else {
            this.setState({
                competitors: competitor,
            });
        }
    };

    public onClickBack = (nextStep, moveSuccess) => {
        if (moveSuccess) {
            allTrackers.trackEvent("wizard", "click", `marketing wizard/move back/${nextStep + 1}`);
        }
        if (nextStep === -1) {
            if (!this.isOnboarding) {
                this.props.showTopNav();
            }
            if (this.isRenderingNewArena) {
                this.props.populateTopBar();
            }
            history.back();
        }
    };

    public getAvailableCountries = () => {
        return utils.getCountries(true);
    };

    public onCountryChange = (country) => {
        allTrackers.trackEvent(
            "wizard",
            "Click",
            `marketing wizard/select main country/${country.text}`,
        );
        this.setState({
            selectedCountry: country,
        });
    };

    public onCountryChangeOnboarding = (country) => {
        this.setState({
            selectedCountry: country,
        });
    };

    public render() {
        let part = null;

        if (this.props.arenaId) {
            part = this.renderEditArena();
        } else if (this.isOnboarding) {
            part = this.renderOnboardingArena();
        } else {
            part = this.renderNewArena();
        }

        return (
            <>
                {this.isTrial && !this.isTrialExpired && this.onboardArenaCreated && (
                    <TrialBanner />
                )}
                <TranslationProvider translate={i18nFilter()}>{part}</TranslationProvider>
            </>
        );
    }

    public back = () => {
        history.back();
    };

    public renderEditArena() {
        const {
            onSelectMainSite,
            onClearMainSite,
            getAutoCompleteSuggestions,
            getSuggestions,
            onCompetitorsUpdate,
            getAvailableCountries,
            onCountryChange,
        } = this;
        const {
            selectedCountry,
            selectedSite,
            competitors,
            isLoading,
            isDeletingArena,
        } = this.state;
        const EditStep = createWizardStep("", (p) => (
            <EditArena
                {...p}
                selectedSite={selectedSite}
                competitors={this.state.competitors}
                getSuggestions={getSuggestions}
                onCompetitorsUpdate={onCompetitorsUpdate}
                getAutoComplete={getAutoCompleteSuggestions}
                selectedCountry={this.state.selectedCountry}
                availableCountries={getAvailableCountries()}
                onCountryChange={onCountryChange}
                subscriptionComponent={this.getSubscriptionComponent(SubscribeToArenaEdit)}
                onSave={this.onSaveButtonClick}
                getWebsitesSuggestions={getAutoCompleteSuggestions}
                onSelectMainSite={onSelectMainSite}
                arena={this.props.arena}
                isLoading={isLoading}
                onDeleteArena={this.props.isLastArena ? null : this.onDeleteArena}
                onClearMainSite={onClearMainSite}
                isDeletingArena={isDeletingArena}
            />
        ));
        return (
            <Wizard
                steps={[EditStep]}
                onClickBack={this.back}
                getBackButtonText={(step) => i18nFilter()("workspaces.marketing.wizard.goback")}
                showBackButton={(step) => true}
                showStepsLegends={false}
            />
        );
    }

    public renderNewArena() {
        const {
            onSelectMainSite,
            onClearMainSite,
            getAutoCompleteSuggestions,
            getSuggestions,
            onCompetitorsUpdate,
            getAvailableCountries,
            onCountryChange,
            onWorkspaceNameChange,
            onWelcomeButtonClick,
            onSaveButtonClick,
            onClickBack,
            isOnboarding,
            isTrial,
        } = this;
        const { selectedCountry, selectedSite, competitors, isLoading } = this.state;
        const { workspaceId, hasMultipleWorkspaces } = this.props;

        const welcomeComponent = !workspaceId && (
            <WelcomeStep
                user={similarweb.settings.user.firstname}
                onWorkspaceNameChange={onWorkspaceNameChange}
                workspaceNameEnabled={hasMultipleWorkspaces}
                onNextStep={onWelcomeButtonClick}
                isOnboarding={isOnboarding}
            />
        );
        const SelectCompetitorsStepStep = createWizardStep(
            "workspaces.marketing.wizard.legends.select_competitors",
            (p) => (
                <SelectCompetitors
                    {...p}
                    getSuggestions={getSuggestions}
                    selectedSite={selectedSite}
                    getAutoComplete={getAutoCompleteSuggestions}
                    competitors={competitors}
                    onCompetitorsUpdate={onCompetitorsUpdate}
                    enableSmallSiteNotification={isTrial}
                    showBackButton={isTrial}
                />
            ),
        );

        const ChooseMySiteStep = createWizardStep(
            "workspaces.marketing.wizard.legends.enter_a_website",
            (p) => (
                <ChooseMySite
                    {...p}
                    onSelectMainSite={onSelectMainSite}
                    onClearMainSite={onClearMainSite}
                    selectedSite={selectedSite}
                    getWebsitesSuggestions={getAutoCompleteSuggestions}
                    onCountryChange={onCountryChange}
                    availableCountries={getAvailableCountries()}
                    selectedCountry={selectedCountry}
                    enableSmallSiteNotification={isTrial}
                    isFirstArena={!workspaceId && hasMultipleWorkspaces}
                    showBackButton={isTrial}
                />
            ),
        );

        const SummaryStep = createWizardStep(
            "workspaces.marketing.wizard.steps.legends.summary.title",
            (p) => (
                <Summary
                    {...p}
                    selectedCountry={selectedCountry}
                    selectedSite={selectedSite}
                    competitors={competitors}
                    onSave={onSaveButtonClick}
                    subscriptionComponent={this.getSubscriptionComponent(SubscribeToArenaSummary)}
                    isLoading={isLoading}
                    showBackButton={isTrial}
                />
            ),
        );

        return (
            <>
                <WithHelpWidgetArticle articleId={HELP_ARTICLE_IDS.CREATE_ARENA_ONBOARDING} />
                <Wizard
                    welcomeComponent={welcomeComponent}
                    steps={[ChooseMySiteStep, SelectCompetitorsStepStep, SummaryStep]}
                    onClickBack={onClickBack}
                    showBackButton={(step) => !isTrial}
                />
            </>
        );
    }

    public getSubscriptionComponent = (Component: React.FunctionComponent) => {
        return (
            <Component>
                <div>{i18nFilter()("workspace.marketing.subscription.title")}</div>
                <OnOffSwitch
                    isSelected={this.state.subscribedToArena}
                    onClick={this.onSubscriptionToggle}
                />
            </Component>
        );
    };

    public onSubscriptionToggle = async () => {
        allTrackers.trackEvent(
            "Toggle",
            "click",
            `email_registration/${this.state.subscribedToArena ? "off" : "on"}`,
        );
        this.setState({ subscribedToArena: !this.state.subscribedToArena });
    };

    public onWelcomeButtonClick = () => {
        this.props.hideTopNav();
    };

    public renderOnboardingArena() {
        const {
            onSelectMainSiteOnboarding,
            onClearMainSite,
            getAutoCompleteSuggestions,
            getOnboardingSuggestions,
            onCompetitorsUpdate,
            getAvailableCountries,
            onCountryChangeOnboarding,
            onSaveButtonClick,
            onClickBack,
            isOnboarding,
            isTrial,
        } = this;
        const { selectedCountry, selectedSite, competitors, isLoading } = this.state;

        const welcomeComponent = <WelcomeStep isOnboarding={isOnboarding} />;

        const SelectCompetitorsStepStep = createWizardStep(
            "workspaces.marketing.wizard.select_competitors",
            (restProps) => (
                <SelectCompetitors
                    {...restProps}
                    getSuggestions={getOnboardingSuggestions}
                    selectedSite={selectedSite}
                    getAutoComplete={getAutoCompleteSuggestions}
                    competitors={competitors}
                    onCompetitorsUpdate={onCompetitorsUpdate}
                    enableSmallSiteNotification={isTrial}
                    showBackButton={isOnboarding}
                />
            ),
        );

        const ChooseMySiteStep = createWizardStep(
            "workspaces.marketing.wizard.enter_a_website",
            (restProps) => (
                <ChooseMySite
                    {...restProps}
                    onSelectMainSite={onSelectMainSiteOnboarding}
                    onClearMainSite={onClearMainSite}
                    selectedSite={selectedSite}
                    getWebsitesSuggestions={getAutoCompleteSuggestions}
                    onCountryChange={onCountryChangeOnboarding}
                    availableCountries={getAvailableCountries()}
                    enableSmallSiteNotification={isTrial}
                    selectedCountry={selectedCountry}
                    showBackButton={isOnboarding}
                />
            ),
        );

        const SummaryStep = createWizardStep(
            "workspaces.marketing.wizard.steps.summary.title",
            (p) => (
                <Summary
                    {...p}
                    selectedCountry={selectedCountry}
                    selectedSite={selectedSite}
                    competitors={competitors}
                    onSave={onSaveButtonClick}
                    isLoading={isLoading}
                    showBackButton={isOnboarding}
                />
            ),
        );

        return (
            <>
                <WithHelpWidgetArticle articleId={HELP_ARTICLE_IDS.CREATE_ARENA_ONBOARDING} />
                <OnboardingWizard
                    welcomeComponent={welcomeComponent}
                    steps={[ChooseMySiteStep, SelectCompetitorsStepStep, SummaryStep]}
                    onClickBack={onClickBack}
                    hideLegend={!isOnboarding}
                    showBackButton={() => !isOnboarding}
                    showStepsLegends={isOnboarding}
                />
            </>
        );
    }

    public onWorkspaceNameChange = (value) => {
        this.setState({
            workspaceName: value,
        });
    };

    public onDeleteArena = async () => {
        const { workspaceId, nextArenaId } = this.props;
        const { isDeletingArena } = this.state;
        if (isDeletingArena) {
            return;
        }
        this.setState(
            {
                isDeletingArena: true,
            },
            async () => {
                try {
                    await marketingWorkspaceApiService.deleteArena(this.props.arenaId);
                    marketingWorkspaceGo("marketingWorkspace-arena", {
                        workspaceId,
                        arenaId: nextArenaId,
                    });
                } catch (e) {
                    swLog.error("Error in deleting arena to workspace: ", e);
                    marketingWorkspaceGo("marketingWorkspace-arena", {
                        workspaceId,
                        arenaId: nextArenaId,
                    });
                    this.setState({
                        isLoading: false,
                        isDeletingArena: false,
                    });
                }
            },
        );
    };

    public removeMWsEmailNotificationBubble = (workspaceId: string, arenaId: string) => {
        const key = `emailNotification_marketing_workspace`;
        UIComponentStateService.setItem(key, "localStorage", "true", true);
    };

    public onSaveButtonClick = async (arenaName) => {
        if (this.progress) {
            swLog.info("in progress...");
        } else {
            this.progress = true;
            if (!this.isTrial) {
                this.props.showTopNav();
            }
            this.setState({
                isLoading: true,
            });
            if (this.props.workspaceId) {
                if (this.props.arenaId) {
                    await this.updateArena(arenaName);
                    // reset user preferences
                    const { arenaId } = this.props;
                    await PreferencesService.remove([`${arenaId}`]);
                } else {
                    TrackWithGuidService.trackWithGuid("workspace.marketing.new", "submit-ok", {
                        onboarding: null,
                        trial: this.isTrial ? "/trial" : null,
                    });
                    await this.createNewArena(arenaName);
                }
            }
            // if workspace doesn't exists, create one with the arena
            else {
                TrackWithGuidService.trackWithGuid("workspace.marketing.new", "submit-ok", {
                    onboarding: this.isOnboarding ? "/onboarding" : null,
                    trial: null,
                });
                await this.createNewArenaWithWorkspace(arenaName);
            }
            this.progress = false;
        }
    };

    public createNewArena = async (arenaName) => {
        const { competitors } = this.state;
        const { name } = this.state.selectedSite;
        try {
            const addedArena = await marketingWorkspaceApiService.addArena(
                this.props.workspaceId,
                arenaName,
                this.state.selectedCountry.id,
                [name],
                competitors.map(({ name }) => name),
            );
            const websource = getWebSource(this.state.selectedCountry.id);
            if (this.state.subscribedToArena) {
                await marketingWorkspaceApiService.subscribeToNotification(addedArena.id);
                allTrackers.trackEvent("Toggle", "save", "email_registration/on");
                this.removeMWsEmailNotificationBubble(this.props.workspaceId, addedArena.id);
            }
            marketingWorkspaceGo("marketingWorkspace-arena", {
                workspaceId: this.props.workspaceId,
                arenaId: addedArena.id,
                websource,
            });
            this.setState({
                isLoading: false,
            });
            setTimeout(this.props.populateTopBar, 3000);
        } catch (e) {
            swLog.error("Error in adding arena to workspace: ", e);
            this.setState({
                isLoading: false,
            });
        }
    };

    public createNewArenaWithWorkspace = async (arenaName) => {
        const { competitors } = this.state;
        const { name } = this.state.selectedSite;
        // create the workspace
        const addedWorkspace = await marketingWorkspaceApiService.addMarketingWorkspace(
            this.state.workspaceName || i18nFilter()("workspace.marketing.default.title"),
        );
        // create the arena
        const addedArena = await marketingWorkspaceApiService.addArena(
            addedWorkspace.id,
            arenaName,
            this.state.selectedCountry.id,
            [name],
            competitors.map(({ name }) => name),
        );
        // set sidenav to be open
        saveState(SIDENAV_KEY, false);
        const websource = getWebSource(this.state.selectedCountry.id);
        if (this.state.subscribedToArena) {
            await marketingWorkspaceApiService.subscribeToNotification(addedArena.id);
            allTrackers.trackEvent("Toggle", "save", "email_registration/on");
            this.removeMWsEmailNotificationBubble(addedWorkspace.id, addedArena.id);
        }
        const key = `suggestions_marketing_workspace`;
        UIComponentStateService.setItem(key, "localStorage", "true", true);
        marketingWorkspaceGo(
            "marketingWorkspace-arena",
            {
                workspaceId: addedWorkspace.id,
                arenaId: addedArena.id,
                websource,
            },
            true,
        );
        this.setState({
            isLoading: false,
        });
        if (!this.onboardArenaCreated) {
            PreferencesService.add({ [`${ONBOARD_ARENA_CREATED}`]: true });
            setTimeout(this.props.populateTopBar, 3000);
        }
    };

    public updateArena = async (arenaName) => {
        const { arenaId, workspaceId, arena } = this.props;
        const country = this.state.selectedCountry.id;
        const allies = [this.state.selectedSite.name];
        const { competitors } = this.state;
        try {
            await marketingWorkspaceApiService.updateArena(
                arenaId,
                arenaName,
                country,
                allies,
                competitors.map(({ name }) => name),
            );
            await PreferencesService.remove([`${arenaId}`]);

            if (
                !this.state.subscribedToArena &&
                marketingWorkspaceApiService.isSubscriptionOn(arena)
            ) {
                await marketingWorkspaceApiService.unsubscribeToNotification(arenaId);
                allTrackers.trackEvent("Toggle", "save", "email_registration/off");
            }
            if (
                this.state.subscribedToArena &&
                !marketingWorkspaceApiService.isSubscriptionOn(arena)
            ) {
                await marketingWorkspaceApiService.subscribeToNotification(arenaId);
                allTrackers.trackEvent("Toggle", "save", "email_registration/on");
            }
            marketingWorkspaceGo("marketingWorkspace-arena", { workspaceId, arenaId });
            this.setState({
                isLoading: false,
            });
        } catch (e) {
            swLog.error("Error in updationg arena: ", e);
            this.setState({
                isLoading: false,
            });
        }
    };

    public getChildContext() {
        return {
            translate: i18nFilter(),
            track: allTrackers.trackEvent.bind(allTrackers),
        };
    }

    private isSmallSite = async (site: string) => {
        const fetchService = DefaultFetchService.getInstance();
        const result = await fetchService.get(
            `/api/websiteValidity?keys=${site}&webSource=Desktop&country=${this.state.selectedCountry.id}`,
        );
        return result[site];
    };
    public static childContextTypes = contextTypes;
}

const mapStateToProps = ({ marketingWorkspace: { selectedWorkspace } }) => {
    const arenaId = Injector.get<SwNavigator>("swNavigator").getParams().arenaId;
    const hasMultipleWorkspaces =
        swSettings.components.MarketingWorkspace.resources.WorkspacesLimit > 1;
    if (selectedWorkspace.arenas && selectedWorkspace.arenas.length > 0 && arenaId) {
        const arena: IArena = selectedWorkspace.arenas.find((arena) => arena.id === arenaId);
        let result: any = {
            workspaceId: selectedWorkspace.id,
            arena,
            arenaId,
            hasMultipleWorkspaces,
        };
        if (arena) {
            result = {
                ...result,
                selectedSite: {
                    name: arena.allies[0].domain,
                    image: arena.allies[0].favicon,
                },
                competitors: arena.competitors.map(({ domain, favicon }) => ({
                    name: domain,
                    image: favicon,
                    icon: favicon,
                })),
                isLastArena: selectedWorkspace.arenas.length == 1,
                nextArenaId: selectedWorkspace.arenas[1] && selectedWorkspace.arenas[1].id,
            };
        }
        return result;
    } else {
        return {
            workspaceId: selectedWorkspace.id,
            hasMultipleWorkspaces,
        };
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        marketingWorkspaceSetAllParams: (params) => {
            dispatch(marketingWorkspaceSetAllParams(params));
        },
        showTopNav: () => {
            dispatch(showTopNav());
        },
        hideTopNav: () => {
            dispatch(hideTopNav());
        },
        emptyTopBar: () => {
            dispatch(emptyTopBar());
        },
        populateTopBar: () => {
            dispatch(populateTopBar());
        },
    };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(MarketingWizard);
export default SWReactRootComponent(connected, "MarketingWizard");
