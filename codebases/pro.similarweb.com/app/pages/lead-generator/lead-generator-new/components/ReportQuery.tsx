import _ from "lodash";
import React from "react";
import numeral from "numeral";
import { connect } from "react-redux";
import swLog from "@similarweb/sw-log";
import { AutosizeInput } from "@similarweb/ui-components/dist/autosize-input";
import { ILeadGeneratorReportMetadata } from "actions/leadGeneratorActions";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import { allTrackers } from "services/track/track";
import { LoaderListItems } from "components/Loaders/src/LoaderListItems";
import I18n from "../../../../components/React/Filters/I18n";
import LeadGeneratorPageError from "../../components/LeadGeneratorPageError";
import GroupingModal from "../../dialogs/GroupingModal";
import InvalidPercentsGroupModal from "../../dialogs/InvalidPercentsGroupModal";
import PreviewModal from "../../dialogs/PreviewModal";
import QuotaModal from "../../dialogs/QuotaModal";
import RunReportModal from "../../dialogs/RunReportModal";
import { ISliderFilter } from "../../LeadGeneratorFilters";
import LeadGeneratorUtils from "../../LeadGeneratorUtils";
import { duplicate100 } from ".././components/filters/RangePercentFilter";
import { IQueryConfig } from "../leadGeneratorNewConfig";
import {
    LeadGeneratorNewHeader,
    LeadGeneratorNewLeft,
    LeadGeneratorNewRight,
    LeadGeneratorNewWrapper,
    ReportQueryWrapper,
} from "./elements";
import ReportSummary from "./ReportSummary";
import {
    isDesktopDevice,
    belongsToTrafficGroup,
} from "pages/lead-generator/lead-generator-new/helpers";
import { TOP_SITES_OPTIONS } from "pages/lead-generator/lead-generator-new/filters-options";
import {
    ProductTours,
    ProductToursLocalStorageKeys,
    showIntercomTour,
} from "services/IntercomProductTourService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";

export enum dataStates {
    LOADING,
    LOADED,
    ERROR,
}

// TODO: Refactor, extract, resolve types

interface IReportQueryProps {
    getPreviewData: (reportData) => any;
    onRunReport: (reportData) => void;
    queryConfig: IQueryConfig[];
    availableQuota?: number;
    isUnlimitedQuota?: boolean;
    leadGeneratorReports?: ILeadGeneratorReportMetadata[];
    growContext?: boolean;
    name?: string;
    order_by?: string;
    top?: number;
    filters?: any;
    technologies: ICategoriesResponse;
}

class ReportQuery extends React.Component<IReportQueryProps, any> {
    private dashboardService = Injector.get("dashboardService") as any;

    constructor(props) {
        super(props);
        this.state = {
            name: props.growContext
                ? props.name ||
                  this.dashboardService.generateNewTitle(
                      i18nFilter()("grow.lead_generator.new.report_name.initial"),
                      "title",
                      props.leadGeneratorReports,
                  )
                : "",
            // eslint-disable-next-line @typescript-eslint/camelcase
            order_by: props.order_by,
            top: props.top,
            dataState: dataStates.LOADED,
            isRunModalOpen: false,
            isTrafficSourceModalOpen: false,
            isAgeGroupModalOpen: false,
            isGroupingModalOpen: false,
            isQuotaModalOpen: false,
            isPreviewModalOpen: false,
            previewData: {},
            quotaLoaded: false,
            ...this.initFilters(props),
        };
    }

    UNSAFE_componentWillMount() {
        if (this.props.filters) {
            this.loadExistingReport(this.props.filters);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            if (this.props.filters) {
                this.loadExistingReport(this.props.filters);
            }
            if (this.props.growContext && !this.props.isUnlimitedQuota) {
                this.updateTotalSitesOptions(this.props.availableQuota);
            }
        }
    }

    componentDidMount(): void {
        this.runIntercomTour();
    }

    runIntercomTour(): void {
        const isTourAlreadySeen = localStorage.getItem(
            ProductToursLocalStorageKeys.LeadGeneratorTour,
        );

        if (isTourAlreadySeen === "true") {
            return;
        }

        showIntercomTour(ProductTours.LeadGenerator);
        localStorage.setItem(ProductToursLocalStorageKeys.LeadGeneratorTour, "true");
    }

    loadExistingReport(reportFilters) {
        const existingReportState = { ...reportFilters };

        this.props.queryConfig.forEach((box) => {
            if (box.hasToggle) {
                box.filters.forEach((filter) => {
                    if (reportFilters[filter.stateName]) {
                        existingReportState[box.id] = true;
                    }
                });
            }
        });
        this.setState({ ...existingReportState });
    }

    initFilters(props) {
        const filters = {};
        const initCrrFilter = (filter) => {
            if (!props[filter.stateName]) {
                filters[filter.stateName] = filter.initValue;
            }
            filter.getValue = () => this.state[filter.stateName];
            // This is something incredible
            filter.setValue = (newState) => {
                this.setState(newState);
            };
        };
        this.props.queryConfig.forEach((box) => {
            box.filters.forEach((filter) => initCrrFilter(filter));
            if (box.hasToggle) {
                filters[box.id] = false;
                box.isActive = () => this.state[box.id];
                box.setActive = (val) => this.setState({ [box.id]: val });
            } else {
                box.isActive = () => true;
                box.setActive = _.noop;
            }
        });

        return filters;
    }

    updateTotalSitesOptions(quota) {
        const topSitesFilter = this.props.queryConfig.find((box) => box.id === "generalBox")
            .filters[0] as ISliderFilter;
        const maxOption = Object.keys(TOP_SITES_OPTIONS).reduce(
            (acc, crr) => (crr <= quota ? crr : acc),
            Object.keys(TOP_SITES_OPTIONS)[0],
        );
        topSitesFilter.numberOptions = TOP_SITES_OPTIONS[maxOption];
    }

    getGroupSitesCalc() {
        return LeadGeneratorUtils.getGroupSitesCalc(
            this.state.countries.length,
            this.state.categories.length,
            this.state.top,
        );
    }

    getReportName() {
        if (!this.props.growContext) {
            return this.state.name;
        }
        return `${this.state.name} (${LeadGeneratorUtils.getComponentDate()})`;
    }

    getActiveFilters() {
        const activeFilters = this.props.queryConfig.map((box) =>
            box.getActiveFilters(box.filters, box.isActive()),
        );

        return [].concat(...activeFilters);
    }

    createBoxes() {
        const { technologies, queryConfig } = this.props;

        return queryConfig
            .filter((box) => (box.isBoxActive ? box.isBoxActive(box) : true))
            .map((box, index) => {
                const Component = box.component;

                return (
                    <Component
                        {...box}
                        key={`${index}BOX`}
                        technologies={technologies}
                        dataAutomation={`lead-generator-${_.kebabCase(box.id)}`}
                        isActive={box.isActive()}
                        device={this.state.device}
                        hasValue={box.filters.some((f) => f.hasValue())}
                        disabled={belongsToTrafficGroup(box) && !this.state.countries.length}
                    />
                );
            });
    }

    private onClickRefresh = (): void => {
        this.setState({
            dataState: dataStates.LOADED,
            isRunModalOpen: false,
            isPreviewModalOpen: false,
        });
    };

    disableButtons(): boolean {
        if (!this.props.growContext) {
            return !this.state.countries.length;
        }

        return (
            !LeadGeneratorUtils.isReportNameValid(this.state.name) || !this.state.countries.length
        );
    }

    getReportData() {
        const reportData = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            order_by: this.state.order_by,
            filters: {
                device: this.state.device,
            },
        } as any;

        if (this.props.growContext) {
            reportData.name = this.state.name;
            reportData.top = this.state.top;
        }

        this.getActiveFilters().forEach((filter) => {
            if (filter.stateName !== "order_by" && filter.stateName !== "top") {
                reportData.filters[filter.stateName] = filter.getReportValue(
                    this.state[filter.stateName],
                    this.state,
                );
            }

            if (filter.stateName === "categories") {
                const selectedCategories = filter.getValue();

                if (selectedCategories.length === 0) {
                    delete reportData.filters["categories"];
                }
            }
        });

        return reportData;
    }

    private onRunReport = (): void => {
        try {
            this.setState({ dataState: dataStates.LOADING });
            this.props.onRunReport(this.getReportData());
        } catch (err) {
            swLog.error("ERROR fetching Lead Generator new report data", err);
            this.setState({ dataState: dataStates.ERROR });
        }
    };

    private onPreviewReport = async (): Promise<void> => {
        try {
            const previewData = await this.props.getPreviewData(this.getReportData());

            if (this.state.isPreviewModalOpen) {
                this.setState({ previewData });
            }
        } catch (err) {
            swLog.error("ERROR fetching Lead Generator new report data", err);

            if (this.state.isPreviewModalOpen) {
                this.setState({ dataState: dataStates.ERROR });
            }
        }
    };

    private onClickClosePreviewModal = () => {
        this.setState({ isPreviewModalOpen: false });
        allTrackers.trackEvent(
            "Lead Generation Wizard",
            "Back to editing",
            `Back to filters/${this.state?.previewData?.totalCount ?? 0}`,
        );
    };

    private onClickRunPreviewModal = () => {
        allTrackers.trackEvent(
            "Lead Generation Wizard",
            "run query",
            `lead generation report/from preview/${this.getActiveFilters().length}`,
        );
        this.onRunReport();
    };

    private isGroupingInvalid() {
        return this.state.top / (this.state.countries.length * this.state.categories.length) < 1;
    }

    private isPercentsGroupInvalid(isActive, filters) {
        if (!isActive) {
            return false;
        }

        // TODO: Should extracted from here

        const sumMin = filters.reduce((sum, crr) => {
            const crrValue = this.state[crr.stateName];

            if (crrValue.includes(">=")) {
                return sum + duplicate100(crrValue.replace(">=", ""));
            } else if (crrValue.includes("<=")) {
                return sum;
            }

            return sum + duplicate100(crrValue.split("...")[0]);
        }, 0);
        const sumMax = filters.reduce((sum, crr) => {
            const crrValue = this.state[crr.stateName];

            if (crrValue.includes(">=")) {
                return sum + 100;
            } else if (crrValue.includes("<=")) {
                return sum + duplicate100(crrValue.replace("<=", ""));
            }

            return sum + duplicate100(crrValue.split("...")[1]);
        }, 0);

        return sumMin > 100 || sumMax < 100;
    }

    private isQuotaInvalid() {
        return this.state.top > this.props.availableQuota;
    }

    private isReportValid() {
        if (this.isGroupingInvalid()) {
            this.setState({ isGroupingModalOpen: true });

            return false;
        }

        const trafficSourcesBox = this.props.queryConfig.find(
            (box) => box.id === "trafficSourcesBox",
        );

        if (this.isPercentsGroupInvalid(trafficSourcesBox.isActive(), trafficSourcesBox.filters)) {
            this.setState({ isTrafficSourceModalOpen: true });
            TrackWithGuidService.trackWithGuid(
                "workspace.sales.lead_generator.marketing_channel.open.pop_up",
                "open",
                {},
            );
            return false;
        }
        const demographicBox = this.props.queryConfig.find((box) => box.id === "demographicBox");
        const ageGroupFilters = demographicBox.filters.filter((filter) =>
            filter.stateName.includes("age_group_"),
        );

        if (this.isPercentsGroupInvalid(demographicBox.isActive(), ageGroupFilters)) {
            this.setState({ isAgeGroupModalOpen: true });

            return false;
        }

        if (this.props.growContext && this.isQuotaInvalid()) {
            this.setState({ isQuotaModalOpen: true });

            return false;
        }

        return true;
    }

    private onValidateBeforeRun = () => {
        if (this.isReportValid()) {
            if (this.props.growContext) {
                this.setState({ isRunModalOpen: true });
            } else {
                allTrackers.trackEvent(
                    "Lead Generation Wizard",
                    "run query",
                    `lead generation report/from filters/${this.getActiveFilters().length}`,
                );
                this.onRunReport();
            }
        }
    };

    private onValidateBeforePreview = async () => {
        if (this.isReportValid()) {
            this.setState({ isPreviewModalOpen: true, previewData: {} });
            allTrackers.trackEvent(
                "Lead Generation Wizard",
                "Search preview",
                `Open Search preview/${this.state.order_by}`,
            );
            this.onPreviewReport();
        }
    };

    closeQuotaModal = (): void => {
        this.setState({ isQuotaModalOpen: false });
    };

    onCloseTrafficSourceModalWithTrackService = (
        guid: string,
        action: string,
        replacements: any = {},
    ): (() => void) => (): void => {
        this.setState({ isTrafficSourceModalOpen: false });
        TrackWithGuidService.trackWithGuid(guid, action, replacements);
    };

    render(): JSX.Element {
        const {
            top,
            name,
            device,
            dataState,
            previewData,
            isRunModalOpen,
            isQuotaModalOpen,
            isPreviewModalOpen,
            isGroupingModalOpen,
            isAgeGroupModalOpen,
            isTrafficSourceModalOpen,
        } = this.state;
        if (dataState === dataStates.ERROR) {
            return <LeadGeneratorPageError onClickRefresh={this.onClickRefresh} />;
        }

        if (dataState === dataStates.LOADING) {
            return (
                <LoaderListItems
                    title={<I18n>grow.lead_generator.page.loader.results.title</I18n>}
                    subtitle={<I18n>grow.lead_generator.page.loader.results.subtitle</I18n>}
                />
            );
        }

        return (
            <LeadGeneratorNewWrapper>
                {this.props.growContext && (
                    <LeadGeneratorNewHeader>
                        <AutosizeInput
                            placeholder={i18nFilter()(
                                "grow.lead_generator.new.report_name.placeholder",
                            )}
                            onChange={(event) => this.setState({ name: event.target.value })}
                            value={name}
                            maxLength={LeadGeneratorUtils.REPORT_NAME_MAX_LENGTH}
                        />
                    </LeadGeneratorNewHeader>
                )}
                <ReportQueryWrapper>
                    <LeadGeneratorNewLeft>{this.createBoxes()}</LeadGeneratorNewLeft>
                    <LeadGeneratorNewRight>
                        <ReportSummary
                            reportName={this.getReportName()}
                            reportFilters={this.getActiveFilters()}
                            onClickRun={this.onValidateBeforeRun}
                            onClickPreview={this.onValidateBeforePreview}
                            disableButtons={this.disableButtons()}
                            growContext={this.props.growContext}
                        />
                    </LeadGeneratorNewRight>
                </ReportQueryWrapper>
                <RunReportModal
                    isOpen={isRunModalOpen}
                    reportName={name}
                    reportDate={LeadGeneratorUtils.getComponentDate()}
                    reportMaxResults={numeral(top).format("0,0").toString()}
                    reportGroupResults={numeral(this.getGroupSitesCalc()).format("0,0").toString()}
                    onClickClose={() => this.setState({ isRunModalOpen: false })}
                    onClickDone={this.onRunReport}
                />
                <InvalidPercentsGroupModal
                    isOpen={isTrafficSourceModalOpen}
                    onClickClose={this.onCloseTrafficSourceModalWithTrackService(
                        "workspace.sales.lead_generator.marketing_channel.close.pop_up",
                        "close",
                    )}
                    onClickBtn={this.onCloseTrafficSourceModalWithTrackService(
                        "workspace.sales.lead_generator.marketing_channel.click.pop_up",
                        "click",
                    )}
                >
                    grow.lead_generator.modal.traffic_source.subtitle
                </InvalidPercentsGroupModal>
                <InvalidPercentsGroupModal
                    isOpen={isAgeGroupModalOpen}
                    onClickClose={() => this.setState({ isAgeGroupModalOpen: false })}
                >
                    grow.lead_generator.modal.age_group.subtitle
                </InvalidPercentsGroupModal>
                <GroupingModal
                    isOpen={isGroupingModalOpen}
                    onClickClose={() => this.setState({ isGroupingModalOpen: false })}
                />
                <QuotaModal
                    isOpen={isQuotaModalOpen}
                    onClickClose={this.closeQuotaModal}
                    onClickPurchase={this.closeQuotaModal}
                />
                <PreviewModal
                    isOpen={isPreviewModalOpen}
                    reportDate={LeadGeneratorUtils.getComponentDate()}
                    previewData={previewData}
                    onClickClose={this.onClickClosePreviewModal}
                    isDesktopOnly={isDesktopDevice(device)}
                    onClickRun={this.onClickRunPreviewModal}
                />
            </LeadGeneratorNewWrapper>
        );
    }
}

function mapStateToProps(store) {
    // TODO: Replace with selector function
    const { reports } = store.leadGenerator;

    return {
        leadGeneratorReports: reports,
    };
}

export default connect(mapStateToProps)(ReportQuery);
