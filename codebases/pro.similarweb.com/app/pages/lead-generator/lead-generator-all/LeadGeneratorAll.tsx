import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { DefaultFetchService } from "services/fetchService";
import { LeadGeneratorWrapper, LeadGeneratorTitle } from "../components/elements";
import {
    LeadGeneratorAllWrapper,
    LeadGeneratorAllHeader,
    LeadGeneratorAllLoader,
    LeadGeneratorAllSection,
    LeadGeneratorAllSectionHeader,
} from "./components/elements";
import LeadGeneratorQuota from "../components/LeadGeneratorQuota";
import EmptyState from "./components/EmptyState";
import RunsBox from "./components/RunsBox";
import I18n from "components/React/Filters/I18n";
import LeadGeneratorPageError from "../components/LeadGeneratorPageError";
import { Injector } from "common/ioc/Injector";
import { allTrackers } from "services/track/track";
import { LoaderLogo } from "../../../../.pro-features/components/Loaders/src/LoaderLogo";
import { LoaderListItems } from "../../../../.pro-features/components/Loaders/src/LoaderListItems";
import ScrollListener from "../../../components/React/ScrollListener/ScrollListener";
import ToggleBoxButton from "./components/ToggleBoxButton";
import { fetchLeadGeneratorReportsData } from "../../../actions/leadGeneratorActions";

enum dataStates {
    LOADING,
    LOADED,
    ERROR,
    LOAD_REPORT,
}

@SWReactRootComponent
class LeadGeneratorAll extends Component<any, any> {
    private _fetchService = DefaultFetchService.getInstance();
    private _swNavigator = Injector.get("swNavigator") as any;
    private _isComponentAlive = true;

    constructor(props) {
        super(props);

        this.state = {
            dataState: dataStates.LOADING,
            myReportsRender: 5,
            myReportsOpen: true,
            archivedReportsRender: 5,
            archivedReportsOpen: false,
        };
    }

    componentWillUnmount() {
        this._isComponentAlive = false;
    }

    async componentWillMount() {
        try {
            this.props.fetchUserReports();
            const {
                used: userQuota,
                total: maxQuota,
                isUnlimited,
                isFree,
            } = (await this._fetchService.get("/api/grow-reports-management/quota")) as any;
            this.setState({
                dataState: dataStates.LOADED,
                userQuota,
                maxQuota,
                isUnlimited,
                isFree,
            });
        } catch (err) {
            console.error("ERROR fetching Lead Generator all reports data", err);
            this.setState({ dataState: dataStates.ERROR });
        }
    }

    private onClickCreateReport = () => {
        this._swNavigator.go("leadGenerator.new");
        allTrackers.trackEvent("Internal Link", "click", "create new report/create my new report");
    };

    private createRunsBox() {
        const sections = [
            {
                isOpen: "myReportsOpen",
                boxesToRender: "myReportsRender",
                text: "grow.lead_generator.my_reports",
                reports: this.props.userReports.filter(
                    (report) => report.queryDefinition.status === 0,
                ),
            },
            {
                isOpen: "archivedReportsOpen",
                boxesToRender: "archivedReportsRender",
                text: "grow.lead_generator.archived_reports",
                reports: this.props.userReports.filter(
                    (report) => report.queryDefinition.status === 1,
                ),
            },
        ];
        return (
            <div>
                {sections.map((crrSection) => {
                    return (
                        <LeadGeneratorAllSection
                            key={crrSection.boxesToRender}
                            noReports={
                                !this.state[crrSection.isOpen] || crrSection.reports.length === 0
                            }
                        >
                            <LeadGeneratorAllSectionHeader>
                                <ToggleBoxButton
                                    isOpen={this.state[crrSection.isOpen]}
                                    onClickToggle={() =>
                                        this.setState({
                                            [crrSection.isOpen]: !this.state[crrSection.isOpen],
                                        })
                                    }
                                />
                                <p>
                                    <I18n>{crrSection.text}</I18n> ({crrSection.reports.length})
                                </p>
                            </LeadGeneratorAllSectionHeader>
                            <ScrollListener
                                threshold={200}
                                onThresholdReached={() =>
                                    this.setState({
                                        [crrSection.boxesToRender]:
                                            this.state[crrSection.boxesToRender] + 1,
                                    })
                                }
                            >
                                {this.state[crrSection.isOpen] &&
                                    crrSection.reports
                                        .slice(0, this.state[crrSection.boxesToRender])
                                        .map((crrReport) => (
                                            <RunsBox
                                                key={crrReport.queryDefinition.id}
                                                report={crrReport}
                                                onRunReport={this.onRunReport}
                                            />
                                        ))}
                            </ScrollListener>
                        </LeadGeneratorAllSection>
                    );
                })}
            </div>
        );
    }

    private onClickRefresh = () => {
        this._swNavigator.reload("leadGenerator.all");
    };

    private onRunReport = async (reportId) => {
        this.setState({ dataState: dataStates.LOAD_REPORT });
        allTrackers.trackEvent(
            "create report",
            "submit-ok",
            `lead generation report/new/${reportId}`,
        );
        const runData = (await this._fetchService.post(
            `/api/lead-generator/query/run/${reportId}`,
        )) as any;
        if (this._isComponentAlive) {
            this._swNavigator.go("leadGenerator.exist", {
                reportId: runData.queryId,
                runId: runData.runId,
            });
        }
    };

    public render() {
        if (this.state.dataState === dataStates.LOADING || this.props.userReportsLoading) {
            return (
                <LeadGeneratorAllLoader>
                    <LoaderLogo scale={1} />
                </LeadGeneratorAllLoader>
            );
        }
        if (this.state.dataState === dataStates.ERROR) {
            return <LeadGeneratorPageError onClickRefresh={this.onClickRefresh} />;
        }
        if (this.state.dataState === dataStates.LOAD_REPORT) {
            return (
                <LoaderListItems
                    title={<I18n>grow.lead_generator.page.loader.results.title</I18n>}
                    subtitle={<I18n>grow.lead_generator.page.loader.results.subtitle</I18n>}
                />
            );
        }
        const isEmptyState = !this.props.userReports.length;
        return (
            <LeadGeneratorWrapper>
                <LeadGeneratorAllWrapper isEmptyState={isEmptyState}>
                    <LeadGeneratorAllHeader>
                        <LeadGeneratorTitle>
                            <I18n>grow.lead_generator.all.title</I18n>
                        </LeadGeneratorTitle>
                        <LeadGeneratorQuota
                            userQuota={this.state.userQuota}
                            maxQuota={this.state.maxQuota}
                            isUnlimited={this.state.isUnlimited}
                            isFree={this.state.isFree}
                        />
                    </LeadGeneratorAllHeader>
                    {isEmptyState ? (
                        <EmptyState onClickCreateReport={this.onClickCreateReport} />
                    ) : (
                        this.createRunsBox()
                    )}
                </LeadGeneratorAllWrapper>
            </LeadGeneratorWrapper>
        );
    }
}

function mapStateToProps(store) {
    const { reportsData, reportsDataLoading } = store.leadGenerator;
    return {
        userReports: reportsData,
        userReportsLoading: reportsDataLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUserReports: () => dispatch(fetchLeadGeneratorReportsData()),
    };
}

SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(LeadGeneratorAll),
    "LeadGeneratorAll",
);
