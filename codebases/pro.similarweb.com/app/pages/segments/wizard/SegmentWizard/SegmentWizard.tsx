import swLog from "@similarweb/sw-log/index";
import autobind from "autobind-decorator";
import { swSettings } from "common/services/swSettings";
import { MODE } from "pages/segments/analysis/SegmentsAnalysisTrafficContainer";
import React from "react";
import DurationService from "services/DurationService";
import {
    IFolderPredictions,
    IPopularSegments,
    IRule,
    IWordPredictions,
    RuleTypes,
} from "../../../../../.pro-features/components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import TrackProvider from "../../../../../.pro-features/components/WithTrack/src/TrackProvider";
import TranslationProvider from "../../../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { createWizardStep } from "../../../../../.pro-features/components/Workspace/Wizard/src/steps/createStep";
import { ISite } from "../../../../../.pro-features/components/Workspace/Wizard/src/types";
import { Wizard } from "../../../../../.pro-features/components/Workspace/Wizard/src/Wizard";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import { SwTrack } from "services/SwTrack";
import SWReactRootComponent from "../../../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../../../filters/ngFilters";
import { DefaultFetchService } from "../../../../services/fetchService";
import {
    ISegmentRuleItem,
    ISegmentsUrlParams,
    IWordsFilterConfig,
} from "../../../../services/segments/segmentsWizardServiceTypes";
import SegmentsApiService, {
    DEFAULT_WORDS_FILTER_CONFIGS,
} from "../../../../services/segments/segmentsWizardService";
import { allTrackers } from "../../../../services/track/track";
import { TrackWithGuidService } from "../../../../services/track/TrackWithGuidService";
import {
    IUserSegmentType,
    SegmentCreateUpdateFirstStep,
} from "../SegmentFirstStep/SegmentCreationFirstStep";
import SegmentRulesStep from "../SegmentRulesStep/SegmentRulesStep";
import { getSegmentTypeById, USER_SEGMENT_TYPES } from "../SegmentFirstStep/UserSegmentTypes";
import { connect } from "react-redux";
import {
    receiveFolderPredictions,
    receiveWordPredictions,
    requestFolderPredictions,
    setSegmentsReady,
    requestSegmentsPreview,
    requestWordPredictions,
    resetSegmentsWizardData,
    setSegmentRules,
    setShowWizardTips,
} from "actions/segmentsWizardModuleActions";
import { customSegmentCreatedUpdated } from "actions/segmentsModuleActions";
import { ISegmentWizardProps, ISegmentWizardState } from "./SegmentWizardTypes";
import {
    SegmentsWarningBannerContainer,
    SegmentsWarningBannerContent,
    SegmentsWarningBannerContentPrimary,
    SegmentsWarningBannerContentSecondary,
    WizardContainer,
} from "./SegmentWizardStyles";
import { SwNavigator } from "common/services/swNavigator";
import { RuleBuilderStepContainer } from "../SegmentRulesStep/SegmentRulesStepStyles";
import { any, bool, func, string } from "prop-types";
import rulesQueryHandler from "components/RulesQueryBuilder/src/handlers/rulesQueryHandler";
import { ICustomSegment } from "services/segments/segmentsApiService";
import { ENABLE_FIREBOLT, SegmentsUtils } from "services/segments/SegmentsUtils";
import { withUseAdvancedPref } from "pages/segments/withUseAdvancedPref";

const DEFAULT_WORD_PREDICTIONS_SORT_EXP = "Share+desc";
const DEFAULT_WORD_PREDICTIONS_TIME_GRANULARITY = "Monthly";
const SKIP_FIRST_STEP_FOR_DEBUG = false;

class SegmentWizard extends React.PureComponent<ISegmentWizardProps, ISegmentWizardState> {
    public static propTypes = {
        segmentId: string,
        hasSegments: bool,
        segmentsReady: bool.isRequired,
        segmentsPreviewLoading: bool.isRequired,
        segmentRules: any.isRequired,
        requestWordPredictions: func.isRequired,
        receiveWordPredictions: func.isRequired,
        setSegmentRules: func.isRequired,
        requestSegmentsPreview: func.isRequired,
        resetSegmentsWizardData: func.isRequired,
    };

    private userSegmentTypes: IUserSegmentType[];
    private segmentsApiService: SegmentsApiService;
    private swNavigator: SwNavigator;
    private swSettings = swSettings;
    private isMidTierUser = false;

    constructor(props, context) {
        super(props, context);

        this.swNavigator = Injector.get<SwNavigator>("swNavigator");
        this.userSegmentTypes = USER_SEGMENT_TYPES;
        this.segmentsApiService = new SegmentsApiService();
        this.isMidTierUser = SegmentsUtils.isMidTierUser();

        this.state = {
            userId: undefined,
            selectedSite: undefined,
            segmentName: undefined,
            segmentType: undefined,
        };
    }

    public async componentDidMount() {
        if (SKIP_FIRST_STEP_FOR_DEBUG) {
            console.error(`NOTE: SegmentWizard's SKIP_FIRST_STEP_FOR_DEBUG flag is set to true,
                therefore wizard first step will always be skipped. please set to false before deploying
                to production / sandbox`);
            await this.setupStepTwoForDebugging();
            return;
        }

        const { sid, createNew } = this.swNavigator.getParams();
        if (sid) {
            await this.initializeStateFromApi(sid, createNew);
        }
    }

    public componentWillUnmount() {
        const { resetSegmentsWizardData } = this.props;
        resetSegmentsWizardData();
        this.segmentsApiService.stopWorker();
    }

    public handleSegmentNameOnBlur = (segmentName) => {
        allTrackers.trackEvent(
            "wizard",
            "change",
            `segment wizard/change segment name/${segmentName}`,
        );
    };

    public handleChangeSegmentName = (segmentName: string) => {
        this.setState({ segmentName });
    };

    public handleSelectSegmentType = (segmentType: IUserSegmentType) => {
        allTrackers.trackEvent(
            "wizard",
            "click",
            `segment wizard/select segment type/${segmentType.name}`,
        );
        this.setState({ segmentType });
    };

    public handleSelectMainSite = async (site: ISite) => {
        allTrackers.trackEvent("wizard", "click", `segment wizard/select main site/${site.name}`);

        const selectedSite = await this.validateSelectedSite(site);

        resetSegmentsWizardData();

        this.setState({ selectedSite });

        // if website allowed, perform a fetch for segment urls according to that site
        if (this.isWebsiteAllowed()) {
            this.prepareSegments(selectedSite).then(); // do not await for this
        }

        return selectedSite;
    };

    public handleClearMainSite = () => {
        const { name } = this.state.selectedSite;
        allTrackers.trackEvent("wizard", "click", `segment wizard/clear main site/${name}`);

        // Clear up the selected site, and remove any segment rules, so that
        // we won't keep any rules that are related to the previous site
        this.setState({ selectedSite: null });
        this.updateSegmentRules([]);
        this.updateShowWizardTips(true);
    };

    public getAutoCompleteSuggestions = async (query) => {
        const fetchService = DefaultFetchService.getInstance();
        const { selectedSite } = this.state;
        if (query) {
            let items = await fetchService.get<ISite[]>(
                `/autocomplete/websites?size=9&term=${query}`,
            );
            if (selectedSite) {
                // remove selected site from the autocomplete results
                items = items.filter(({ name }) => name !== selectedSite.name);
            }
            return items;
        }
        return [];
    };

    public updateShowWizardTips = (shouldShowTips: boolean) => {
        const { setShowWizardTips } = this.props;
        setShowWizardTips(shouldShowTips);
    };

    public getWordPredictions = async (
        rules: IRule[],
        shouldFetchWordsOnly = false,
        overrideWordsFilterConfig?: IWordsFilterConfig,
        ruleIndex?: number,
        selectedSite?: ISite,
    ): Promise<IWordPredictions> => {
        const useSelectedSite = selectedSite ?? this.state.selectedSite;
        const predictionRules = this.prepareApiRules(rules, ruleIndex);
        const useWordsFilterConfig = {
            ...(shouldFetchWordsOnly && DEFAULT_WORDS_FILTER_CONFIGS.wordsOnly),
            ...(!useSelectedSite?.validation?.isRobotsTxt &&
                DEFAULT_WORDS_FILTER_CONFIGS.noRobotsTxt),
            ...overrideWordsFilterConfig,
        };

        return await this.segmentsApiService.getWordPredictions(
            predictionRules,
            useWordsFilterConfig,
        );
    };

    public getFolderPredictions = async (
        rules: IRule[],
        ruleIndex?: number,
    ): Promise<IWordPredictions> => {
        const predictionRules = this.prepareApiRules(rules, ruleIndex);

        return await this.segmentsApiService.getFolderPredictions(predictionRules);
    };

    public prepareSegments = async (selectedSite: ISite) => {
        const { setSegmentsReady } = this.props;
        setSegmentsReady(false);
        const useSelectedSite = selectedSite ?? this.state.selectedSite;
        const params = this.prepareApiParams(useSelectedSite.name);
        await this.segmentsApiService.loadPrepareSegments(
            params,
            useSelectedSite.validation.isRobotsTxt,
            true,
        );
        setSegmentsReady(true);
    };

    public updatePredictions = async (
        rules: IRule[],
        shouldFetchWordsOnly = false,
        overrideWordsFilterConfig?: IWordsFilterConfig,
        ruleIndex?: number,
        selectedSite?: ISite,
    ): Promise<void> => {
        const {
            requestWordPredictions,
            receiveWordPredictions,
            receiveFolderPredictions,
            requestFolderPredictions,
        } = this.props;

        try {
            // Signal that we're about to start loading the word predictions
            requestWordPredictions(true);

            // Signal that we're about to start loading the word predictions
            requestFolderPredictions(true);

            // Fetch word predictions
            const [wordPredictions, folderPredictions] = await Promise.all([
                this.getWordPredictions(
                    rules,
                    shouldFetchWordsOnly,
                    overrideWordsFilterConfig,
                    ruleIndex,
                    selectedSite,
                ),
                this.getFolderPredictions(rules, ruleIndex),
            ]);

            // Store word predictions on the redux store
            receiveWordPredictions(wordPredictions);
            requestWordPredictions(false);

            // Store word predictions on the redux store
            receiveFolderPredictions(folderPredictions);
            requestFolderPredictions(false);
        } catch (e) {
            // TODO: log errors here
            requestWordPredictions(false);
            requestFolderPredictions(false);
        }
    };

    public getSegmentsPreview = async (
        rules: IRule[],
        selectedSite?: ISite,
    ): Promise<IPopularSegments> => {
        const { requestSegmentsPreview } = this.props;
        const useSelectedSite = selectedSite ?? this.state.selectedSite;

        // Signal that the segments preview are being loaded
        // (used by the URL List for adding a loader when segments preview are being fetched)
        requestSegmentsPreview(true);
        const popularPagesRules = this.prepareApiRules(rules ?? []);
        const popularPages = await this.segmentsApiService.getPopularPages(
            popularPagesRules,
            useSelectedSite,
        );
        // Signal that we're done loading the segments preview
        requestSegmentsPreview(false);

        return popularPages;
    };

    public hasExistingUrlsCompundStringNoRobots = async (rules: IRule[]): Promise<boolean> => {
        const { requestSegmentsPreview } = this.props;
        const useSelectedSite = this.state.selectedSite;

        // Signal that the segments preview are being loaded
        // (used by the URL List for adding a loader when segments preview are being fetched)
        const params = this.prepareApiParams(useSelectedSite.name);
        const previewRules = this.prepareApiRules(rules ?? []);
        return this.segmentsApiService.hasExistingUrlsCompundStringNoRobots(params, previewRules);
    };
    public updateSegmentRules = (segmentRules: IRule[]) => {
        const { setSegmentRules } = this.props;
        setSegmentRules(segmentRules);
    };

    public handleClickBack = (nextStep, moveSuccess) => {
        if (moveSuccess) {
            allTrackers.trackEvent("wizard", "click", `segment wizard/move back/${nextStep + 1}`);
        }
        if (nextStep === -1) {
            // Clear all segment rules from the redux store, before we quit the wizard
            this.updateSegmentRules([]);
            this.updateShowWizardTips(true);
            history.back();
        }
    };

    public render() {
        const { selectedSite } = this.state;
        const part = this.renderSegmentWizard();
        return (
            <TranslationProvider translate={i18nFilter()}>
                <TrackProvider
                    track={allTrackers.trackEvent.bind(allTrackers)}
                    trackWithGuid={TrackWithGuidService.trackWithGuid}
                >
                    {this.isWebsiteAllowed() && !selectedSite.validation.isRobotsTxt
                        ? this.renderHideUrlsPreviewWarningBanner()
                        : null}
                    <WizardContainer>{part}</WizardContainer>
                </TrackProvider>
            </TranslationProvider>
        );
    }

    public renderSegmentWizard(): JSX.Element {
        const {
            handleSelectMainSite,
            handleClearMainSite,
            getAutoCompleteSuggestions,
            handleChangeSegmentName,
            handleSegmentNameOnBlur,
            userSegmentTypes,
            handleSelectSegmentType,
        } = this;

        const { selectedSite, segmentName, segmentType } = this.state;

        const isWebsiteAllowed = this.isWebsiteAllowed();
        const hideUrlsPreview = !isWebsiteAllowed || !selectedSite?.validation?.isRobotsTxt;

        // The Wizard's first step component
        const firstStepComponent = createWizardStep("segment.wizard.step.1.bullet.title", (p) => (
            <SegmentCreateUpdateFirstStep
                {...p}
                onSelectMainSite={handleSelectMainSite}
                onClearMainSite={handleClearMainSite}
                onChangeSegmentName={handleChangeSegmentName}
                onBlurSegmentName={handleSegmentNameOnBlur}
                onSelectSegmentType={handleSelectSegmentType}
                selectedSite={selectedSite}
                isSelectedSiteAllowed={isWebsiteAllowed}
                segmentName={segmentName}
                segmentSelectedType={segmentType}
                userSegmentTypes={userSegmentTypes}
                getWebsitesSuggestions={getAutoCompleteSuggestions}
            />
        ));

        // The Wizard's second step component (the rule creation component)
        const wordHighlights = this.getRulesHighlightWords();
        const exactMatchHighlights = this.getRulesExactMatchHighlights();

        const secondStepComponent = createWizardStep(
            "workspaces.segment.wizard.createRules",
            () => (
                <SegmentRulesStep
                    rulesHighlightWords={wordHighlights}
                    rulesExactMatchHighlights={exactMatchHighlights}
                    onSetShowWizardTips={this.updateShowWizardTips}
                    selectedSite={selectedSite}
                    key={segmentName}
                    getSegmentsPreview={this.getSegmentsPreview}
                    hasExistingUrlsCompundStringNoRobots={this.hasExistingUrlsCompundStringNoRobots}
                    updateWordPredictions={this.updatePredictions}
                    getWordPredictions={this.getWordPredictions}
                    getFolderPredictions={this.getFolderPredictions}
                    segmentName={segmentName}
                    onSegmentRulesUpdate={this.updateSegmentRules}
                    onCreateOrUpdateCustomSegments={this.onCreateOrUpdateCustomSegments}
                    hideUrlsPreview={hideUrlsPreview}
                />
            ),
            RuleBuilderStepContainer,
        );

        const currentStep = SKIP_FIRST_STEP_FOR_DEBUG ? 1 : 0;
        // const currentStep = 0;

        return (
            <Wizard
                currentStep={currentStep}
                steps={[firstStepComponent, secondStepComponent]}
                onClickBack={this.handleClickBack}
                showBackButton={() => true}
            />
        );
    }

    public renderHideUrlsPreviewWarningBanner(): JSX.Element {
        return (
            <SegmentsWarningBannerContainer>
                <SegmentsWarningBannerContent>
                    <SegmentsWarningBannerContentPrimary>
                        {i18nFilter()(
                            "workspaces.segment.wizard.hide_urls_preview.banner.warning_primary",
                        )}
                    </SegmentsWarningBannerContentPrimary>
                    <SegmentsWarningBannerContentSecondary>
                        {i18nFilter()(
                            "workspaces.segment.wizard.hide_urls_preview.banner.warning_secondary",
                        )}
                    </SegmentsWarningBannerContentSecondary>
                </SegmentsWarningBannerContent>
            </SegmentsWarningBannerContainer>
        );
    }

    public itsMyOwnSegment = (userId) => {
        return +userId === swSettings.user.id ? true : false;
    };

    @autobind
    public async onCreateOrUpdateCustomSegments(rules: IRule[]) {
        const { sid, createNew = false } = this.swNavigator.getParams();

        const { customSegmentCreatedUpdated } = this.props;

        const { segmentName, segmentType, selectedSite, userId } = this.state;

        const rulesSerializer = (res: IRule[], rule: IRule) => {
            const hasContent =
                (rule.words && rule.words.length > 0) ||
                (rule.exact && rule.exact.length > 0) ||
                (rule.folders && rule.folders.length > 0) ||
                (rule.exactURLS && rule.exactURLS.length > 0);

            if (hasContent) {
                res.push({
                    words: rule.words,
                    exact: rule.exact,
                    folders: rule.folders,
                    exactURLS: rule.exactURLS,
                    type: rule.type,
                });
            }
            return res;
        };

        const serializedRules: ISegmentRuleItem[] = rules.reduce(rulesSerializer, []);

        try {
            let newCustomSegment;
            // in case edit my segment
            if (sid && this.itsMyOwnSegment(userId) && !createNew) {
                newCustomSegment = await this.segmentsApiService.updateCustomSegment({
                    segmentName,
                    domain: selectedSite.name,
                    segmentType: Number.parseInt(segmentType.id),
                    rules: serializedRules,
                    id: sid,
                });
                SwTrack.all.trackEvent(
                    "button",
                    "click",
                    `segmentWizard/updateCustomSegment/${sid}`,
                );
            }
            //in cases 1.create new segment 2.copy and edit organization segment 3.copy and edit my segment
            else {
                const params = {
                    segmentName,
                    domain: selectedSite.name,
                    segmentType: Number.parseInt(segmentType.id),
                    rules: serializedRules,
                };
                newCustomSegment = await this.segmentsApiService.createCustomSegment(params);
                SwTrack.all.trackEvent("button", "click", `segmentWizard/createCustomSegment`);
            }
            customSegmentCreatedUpdated(newCustomSegment);
            const currentModule = this.swNavigator.getCurrentModule();
            const segmentAnalysisStateName = `${currentModule}-analysis-traffic`;
            this.swNavigator.go(segmentAnalysisStateName, {
                ...SegmentsUtils.getPageFilterParams(newCustomSegment.id),
                mode: MODE.single,
                id: newCustomSegment.id,
            });
        } catch (e) {
            swLog.error("Failed serializing rules in SegmentWizard", e);
        }
    }

    private initializeStateFromApi = async (sid: string, createNew?: string): Promise<void> => {
        try {
            this.updateShowWizardTips(true);

            // Load all segments data from the API
            const segmentMeta = await this.segmentsApiService.getCustomSegmentMetaData({ sid });

            const selectedSite = { name: segmentMeta.domain, image: segmentMeta.favicon };
            const segmentNameVal =
                this.itsMyOwnSegment(segmentMeta.userId) &&
                String(createNew).toLowerCase() !== "true"
                    ? segmentMeta.segmentName
                    : `${i18nFilter()("workspaces.segment.wizard.copy.of")} ${
                          segmentMeta.segmentName
                      }`;
            this.setState({
                selectedSite,
                userId: segmentMeta.userId,
                segmentName: segmentNameVal,
                segmentType: getSegmentTypeById(segmentMeta.segmentType.toString()),
            });
            await this.handleSelectMainSite(selectedSite);

            const existingSegmentRules = segmentMeta.rules.map((rule) => {
                const ruleWords = rule?.words ?? [];
                const ruleExact = rule?.exact ?? [];
                const ruleFolders = rule?.folders ?? [];
                const ruleExactURLS = rule?.exactURLS ?? [];

                return {
                    type: rule.type,
                    words: [...ruleWords],
                    exact: [...ruleExact],
                    folders: [...ruleFolders],
                    exactURLS: [...ruleExactURLS],
                };
            });

            const newRule = rulesQueryHandler.createNewRule();
            existingSegmentRules.push(newRule);
            this.updateSegmentRules(existingSegmentRules);

            // In case we're loading our data from api, we should't display segment wizard tips,
            // since this means that the user edits an existing segment that he created.
            this.updateShowWizardTips(false);
        } catch (e) {
            swLog.error("Error initializing wizard state", e);
        }
    };

    private isWebsiteAllowed(selectedSite?: ISite) {
        selectedSite = selectedSite ?? this.state.selectedSite;
        const { useAdvancedPref } = this.props;
        if (!selectedSite?.validation || selectedSite?.validation.isInvalid) {
            return false;
        }
        if (ENABLE_FIREBOLT && useAdvancedPref.value) {
            return true;
        }
        if (this.isMidTierUser) {
            return (
                selectedSite.validation.isWhitelisted &&
                selectedSite.validation.isRobotsTxt &&
                !selectedSite.validation.isInvalid
            );
        }
        return selectedSite.validation.isWhitelisted && !selectedSite.validation.isInvalid;
    }

    private async validateSelectedSite(selectedSite: ISite): Promise<ISite> {
        const validatedSelectedSite: ISite = { ...selectedSite };
        if (!validatedSelectedSite.validation) {
            let validatedDomain;
            try {
                validatedDomain = (
                    await this.segmentsApiService.isDomainWhiteListedForSegmentation({
                        keys: [selectedSite.name],
                    })
                )[0];
                const isWhitelisted = !!validatedDomain.isWhitelisted;
                const isRobotsTxt = !!validatedDomain.isRobotsTxt;
                validatedSelectedSite.validation = {
                    isWhitelisted,
                    isRobotsTxt,
                };
            } catch (err) {
                swLog.error("Error validating domain", err);
                //black listed sites such as facebook.com
                validatedSelectedSite.validation = {
                    isInvalid: true,
                };
            }

            if (!this.isWebsiteAllowed(validatedSelectedSite)) {
                SwTrack.all.trackEvent(
                    "wizard",
                    "validationFailure",
                    `segment wizard/${validatedSelectedSite.name}`,
                );
            }
        }
        return validatedSelectedSite;
    }

    private getRulesHighlightWords = () => {
        const { segmentRules } = this.props;
        return this.segmentsApiService.getRulesHighlightWords(segmentRules ?? []);
    };

    private getRulesExactMatchHighlights = () => {
        const { segmentRules } = this.props;
        return this.segmentsApiService.getRulesExactMatchPhrases(segmentRules ?? []);
    };

    private setupStepTwoForDebugging = async () => {
        await this.handleSelectMainSite({
            name: "apple.com",
            image:
                "https://site-images.similarcdn.com/image?url=apple.com&t=2&s=1&h=f81bb484ae2fd14ee7d230f4992fcf6f0e071e846a94e3f49400616e3f9c5063",
            // validated: true,
            // isWhitelisted: true,
            // isRobotsTxt: false,
        });

        this.handleSelectSegmentType({
            id: "1",
            name: "category",
        });

        this.handleChangeSegmentName("testing apple");
    };

    private prepareApiParams = (selectedSiteName: string): ISegmentsUrlParams => {
        const durationData = DurationService.getDurationData(
            "18m",
            undefined,
            this.swSettings.current.componentId,
        );
        return {
            from: durationData.forAPI.from,
            to: durationData.forAPI.to,
            includeSubDomains: true,
            isWindow: false,
            orderBy: DEFAULT_WORD_PREDICTIONS_SORT_EXP,
            timeGranularity: DEFAULT_WORD_PREDICTIONS_TIME_GRANULARITY,
            keys: selectedSiteName,
        };
    };

    private prepareApiRules = (rules: IRule[], ruleIndex?: number) => {
        const rulesForApi =
            rules
                ?.slice(0, ruleIndex ?? rules.length)
                ?.filter(
                    (x) =>
                        x.words.length > 0 ||
                        x.exact.length > 0 ||
                        x.folders.length > 0 ||
                        x.exactURLS.length > 0,
                ) ?? [];

        return (
            rulesForApi?.map((rule, idx) => {
                let ruleType: number;
                if (rule.type === RuleTypes.include) {
                    ruleType = 0;
                } else if (rule.type === RuleTypes.exclude) {
                    ruleType = 1;
                }
                const words = ruleIndex !== -1 && idx === ruleIndex ? [] : rule.words;
                const exact = ruleIndex !== -1 && idx === ruleIndex ? [] : rule.exact;
                const folders = ruleIndex !== -1 && idx === ruleIndex ? [] : rule.folders;
                const exactURLS = ruleIndex !== -1 && idx === ruleIndex ? [] : rule.exactURLS;
                return {
                    words,
                    exact,
                    folders,
                    exactURLS,
                    type: ruleType,
                };
            }) ?? []
        );
    };
}

function mapStateToProps({
    segmentsWizardModule: { segmentRules, segmentsPreviewLoading, showWizardTips },
}) {
    return {
        segmentRules,
        segmentsPreviewLoading,
        showWizardTips,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        requestWordPredictions: (wordPredictionsLoading: boolean) => {
            dispatch(requestWordPredictions(wordPredictionsLoading));
        },

        receiveWordPredictions: (wordPredictions: IWordPredictions) => {
            dispatch(receiveWordPredictions(wordPredictions));
        },

        requestFolderPredictions: (folderPredictionsLoading: boolean) => {
            dispatch(requestFolderPredictions(folderPredictionsLoading));
        },

        receiveFolderPredictions: (folderPredictions: IFolderPredictions) => {
            dispatch(receiveFolderPredictions(folderPredictions));
        },

        setSegmentRules: (segmentRules: IRule[]) => {
            dispatch(setSegmentRules(segmentRules));
        },

        setShowWizardTips: (showWizardTips: boolean) => {
            dispatch(setShowWizardTips(showWizardTips));
        },

        requestSegmentsPreview: (segmentsPreviewLoading: boolean) => {
            dispatch(requestSegmentsPreview(segmentsPreviewLoading));
        },

        customSegmentCreatedUpdated: (customSegment: ICustomSegment) => {
            dispatch(customSegmentCreatedUpdated(customSegment));
        },

        resetSegmentsWizardData: () => {
            dispatch(resetSegmentsWizardData());
        },

        setSegmentsReady: (segmentsReady: boolean) => {
            dispatch(setSegmentsReady(segmentsReady));
        },
    };
}

const ConnectedSegmentWizard = withUseAdvancedPref(
    connect(mapStateToProps, mapDispatchToProps)(SegmentWizard),
);
SWReactRootComponent(ConnectedSegmentWizard, "SegmentWizard");
