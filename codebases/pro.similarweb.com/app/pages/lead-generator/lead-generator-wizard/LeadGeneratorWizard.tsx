import React from "react";
import _ from "lodash";
import { Injector } from "common/ioc/Injector";
import { DefaultLegendItem } from "components/Workspace/Wizard/src/DefaultLegendItem";
import { IStep, Wizard, WizardContext } from "components/Workspace/Wizard/src/Wizard";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { QuotaWrapper } from "pages/lead-generator/lead-generator-wizard/components/StyledComponents";
import { QuotaIndicatorSearchResult } from "pages/workspace/common/QuotaIndicatorSearchResult";
import { DefaultFetchService } from "services/fetchService";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { IOpportunityCapitalized } from "services/workspaces/workspaceApi.types";
import TrackProvider from "../../../../.pro-features/components/WithTrack/src/TrackProvider";
import TranslationProvider from "../../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { IOpportunityListItem, ISavedSearchItem } from "../../workspace/common/types";
import WizardBox from "../lead-generator-new/components/boxes/WizardBox";
import ReportQuery from "../lead-generator-new/components/ReportQuery";
import { IQueryConfig, newReportConfig } from "../lead-generator-new/leadGeneratorNewConfig";
import { SwitcherFilter } from "../LeadGeneratorFilters";
import ReportResults from "./components/ReportResults";
import { SORT_BY_OPTIONS } from "pages/lead-generator/lead-generator-new/filters-options";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";
import "../leadGenerator.scss";
import { ILeadGeneratorWorkspaceApi } from "./types";

// TODO: Refactor, extract, resolve types
interface ILeadGeneratorWizardProps {
    activeOpportunitiesList: IOpportunityListItem;
    workspaceApi: ILeadGeneratorWorkspaceApi;
    onAddOpportunities: any;
    onAddItemToExistOpportunityList?: any;
    initialKeys?: IOpportunityCapitalized[];
    closeWizard: (opportunities) => void;
    activeWorkspace: any;
    deleteOpportunityList: any;
    workspaceType: string;
    activeSavedSearchFilterData?: ISavedSearchItem;
    clearSavedSearchFilterData?: VoidFunction;
    setLeadsGeneratorReport: (queryId, runId) => void;
    removeLeadsGeneratorReport: VoidFunction;
    technologies: ICategoriesResponse;
}

interface ILeadGeneratorWizardState {
    order_by: string;
    filters: any;
    queryId: string;
    runId: string;
}

@SWReactRootComponent
export class LeadGeneratorWizard extends React.Component<
    ILeadGeneratorWizardProps,
    ILeadGeneratorWizardState
> {
    public static defaultProps = {
        initialKeys: [],
    };

    private _fetchService = DefaultFetchService.getInstance() as any;
    private _queryConfig: IQueryConfig[] = [...newReportConfig];
    private swNavigator = Injector.get<any>("swNavigator");
    private isSearchIdInURL = null;

    constructor(props) {
        super(props);

        let data = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            order_by: "",
            filters: null,
            queryId: "",
            runId: "",
        };

        const { activeSavedSearchFilterData } = props;

        if (activeSavedSearchFilterData && Object.keys(activeSavedSearchFilterData).length) {
            data = Object.assign({}, data, activeSavedSearchFilterData);
        }

        this.state = {
            ...data,
        };

        // FIXME: This is sad
        this._queryConfig[0] = {
            id: "generalBox",
            component: WizardBox,
            getActiveFilters: (filters) => filters,
            title: "grow.lead_generator.wizard.general.title",
            subtitle: "grow.lead_generator.wizard.general.subtitle",
            filters: [
                new SwitcherFilter(
                    "order_by",
                    "grow.lead_generator.new.general.sort_websites_by",
                    SORT_BY_OPTIONS,
                ),
            ],
        };
        this._queryConfig[1] = {
            ...this._queryConfig[1],
            groupingWarning: false,
        };
        this._queryConfig[3] = {
            ...this._queryConfig[3],
            groupingWarning: false,
        };
    }

    getInfoItemComponent = (currentStep, stepsLen) => {
        const { workspaceType, activeWorkspace } = this.props;
        let cmp = null;

        if (currentStep + 1 === stepsLen) {
            cmp = (
                <QuotaWrapper>
                    <QuotaIndicatorSearchResult
                        workspaceType={workspaceType}
                        workspaceId={activeWorkspace}
                    />
                </QuotaWrapper>
            );
        }

        return cmp;
    };

    componentDidMount(): void {
        const { queryId, runId } = this.state;
        this.props.setLeadsGeneratorReport(queryId, runId);
    }

    getStep1 = (technologies: ICategoriesResponse): IStep => ({
        LegendItem: (props) =>
            !this.isSearchIdInURL ? (
                <DefaultLegendItem {...props} label="grow.lead_generator.wizard.step1" />
            ) : null,
        StepComponent: ({ step }) => (
            <WizardContext>
                {({ goToStep }) => (
                    <ReportQuery
                        technologies={technologies}
                        getPreviewData={this.getPreviewData}
                        onRunReport={this.onRunReport(step, goToStep)}
                        queryConfig={this._queryConfig}
                        order_by={this.state.order_by}
                        filters={this.state.filters}
                    />
                )}
            </WizardContext>
        ),
    });

    getStep2 = (): IStep => {
        return {
            LegendItem: (props) =>
                !this.isSearchIdInURL ? (
                    <DefaultLegendItem {...props} label="grow.lead_generator.wizard.step2" />
                ) : null,
            StepComponent: ({ step }) => (
                <WizardContext>
                    {({ goToStep }) => (
                        <ReportResults
                            order_by={this.state.order_by}
                            workspaceId={this.props.activeWorkspace}
                            workspaceType={this.props.workspaceType}
                            opportunitiesListId={
                                this.props.activeOpportunitiesList?.opportunityListId
                            }
                            filters={this.state.filters}
                            queryId={this.state.queryId}
                            serverApi={this.props.workspaceApi.results(
                                this.state.queryId,
                                this.state.runId,
                            )}
                            onAddOpportunities={this.onAddOpportunities}
                            onAddItemToExistOpportunityList={
                                this.props.onAddItemToExistOpportunityList
                            }
                            onBack={() => this.onBackResults(step, goToStep)}
                            initialKeys={this.props.initialKeys.map(({ Domain }) => ({
                                Domain,
                            }))}
                        />
                    )}
                </WizardContext>
            ),
        };
    };

    getPreviewData = async (reportData): Promise<void> =>
        await this._fetchService.post(this.props.workspaceApi.preview, reportData);

    onRunReport = (step, goToStep) => async (reportData) => {
        const { queryId, runId } = await this._fetchService.post(
            this.props.workspaceApi.query,
            reportData,
        );

        this.props.setLeadsGeneratorReport(queryId, runId);

        this.setState(
            {
                // eslint-disable-next-line @typescript-eslint/camelcase
                order_by: reportData.order_by,
                filters: _.fromPairs(
                    Object.entries(reportData.filters).map(
                        ([filterName, filterData]: [string, { toClientData?: () => any }]) => {
                            if (!filterData.toClientData) {
                                return [filterName, filterData];
                            } else {
                                return [filterName, filterData.toClientData()];
                            }
                        },
                    ),
                ),
                queryId,
                runId,
            },
            () => goToStep(step + 1),
        );
    };

    onAddOpportunities = (opportunities, newListName): void => {
        const {
            filters: { categories = [], countries },
        } = this.state;
        const { onAddOpportunities } = this.props;

        allTrackers.trackEvent(
            "Lead Generation Wizard",
            "save companies",
            "Save companies to list/lead generation report",
        );

        onAddOpportunities(opportunities, newListName, categories[0], countries[0]);
    };

    onBackResults = (step, goToStep): void => {
        goToStep(step - 1);
    };

    onBackWizard = (nextStep, moveSuccess): void => {
        if (this.props?.clearSavedSearchFilterData) {
            // TODO only for sales workspace
            this.props.clearSavedSearchFilterData();
        }

        this.props.removeLeadsGeneratorReport();

        if (moveSuccess) {
            allTrackers.trackEvent(
                "Lead Generation Wizard",
                `back to step ${nextStep}`,
                "lead generation report",
            );
        } else {
            allTrackers.trackEvent(
                "Lead Generation Wizard",
                "back to workspace",
                "lead generation report",
            );
            this.props.closeWizard(this.props.initialKeys.length);
        }
    };

    onBackHome = (): void => {
        const { initialKeys, closeWizard, removeLeadsGeneratorReport } = this.props;

        // TODO new tracking event
        removeLeadsGeneratorReport();
        closeWizard(initialKeys.length);
    };

    getBackButtonText = (crrStep): string => {
        if (crrStep === 0) {
            return "grow.lead_generator.wizard.back";
        }

        return "workspaces.marketing.wizard.goback";
    };

    render(): JSX.Element {
        const { technologies } = this.props;
        let wizard;

        this.isSearchIdInURL = this.swNavigator.getParams().searchId;

        if (this.isSearchIdInURL) {
            wizard = (
                <Wizard
                    steps={[this.getStep2()]}
                    showBackButton={() => true}
                    hideLegend={false}
                    onClickBack={this.onBackHome}
                    getBackButtonText={this.getBackButtonText}
                    infoBoxOnRightInLegend={this.getInfoItemComponent}
                />
            );
        } else {
            wizard = (
                <Wizard
                    steps={[this.getStep1(technologies), this.getStep2()]}
                    showBackButton={() => true}
                    onClickBack={this.onBackWizard}
                    getBackButtonText={this.getBackButtonText}
                    infoBoxOnRightInLegend={this.getInfoItemComponent}
                />
            );
        }

        return (
            <TranslationProvider translate={i18nFilter()}>
                <TrackProvider
                    track={allTrackers.trackEvent.bind(allTrackers)}
                    trackWithGuid={TrackWithGuidService.trackWithGuid}
                >
                    {wizard}
                </TrackProvider>
            </TranslationProvider>
        );
    }
}
