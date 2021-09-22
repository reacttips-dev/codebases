import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { allTrackers } from "services/track/track";
import ReportQuery from "./components/ReportQuery";
import { DefaultFetchService } from "services/fetchService";
import { Injector } from "common/ioc/Injector";
import LeadGeneratorReturnLink from "../components/LeadGeneratorReturnLink";
import { fetchLeadGeneratorReports } from "actions/leadGeneratorActions";
import { LeadGeneratorNewHeader, LeadGeneratorNewWrapper } from "./components/elements";
import { IQueryConfig, newReportConfig } from "./leadGeneratorNewConfig";
import { ILeadGeneratorReportMetadata } from "../../../actions/leadGeneratorActions";
import { LeadGeneratorAllLoader } from "../lead-generator-all/components/elements";
import { LoaderLogo } from "../../../../.pro-features/components/Loaders/src/LoaderLogo";

interface ILeadGeneratorNewProps {
    fetchReports: () => void;
    leadGeneratorReports?: ILeadGeneratorReportMetadata[];
}

interface ILeadGeneratorNewState {
    loading: boolean;
    availableQuota: number;
    isUnlimitedQuota: boolean;
    name?: string;
    order_by?: string;
    top?: number;
    filters?: any;
}

@SWReactRootComponent
export class LeadGeneratorNew extends Component<ILeadGeneratorNewProps, ILeadGeneratorNewState> {
    private _fetchService = DefaultFetchService.getInstance() as any;
    private _swNavigator = Injector.get("swNavigator") as any;
    private _dashboardService = Injector.get("dashboardService") as any;
    private _reportId = this._swNavigator.getParams().reportId;
    private _newReportConfig: IQueryConfig[] = [...newReportConfig];
    private _isComponentAlive = true;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            availableQuota: 0,
            isUnlimitedQuota: false,
        };
    }

    componentWillUnmount() {
        this._isComponentAlive = false;
    }

    async componentWillMount() {
        const { used, total, isUnlimited: isUnlimitedQuota } = await this._fetchService.get(
            "/api/grow-reports-management/quota",
        );
        this.setState({ availableQuota: total - used, isUnlimitedQuota });
        if (this._reportId) {
            const { queryDefinition } = await this._fetchService.get(
                `/api/lead-generator/query/${this._reportId}`,
            );
            const { name, order_by, top, filters, status } = queryDefinition;
            const nameWithoutCopy = name.replace(/(Copy)s(d+)$/, "$1 ").substr(0, 95);
            const isDeleted = status === 2;
            this.setState({
                name: this._dashboardService.generateNewTitle(
                    isDeleted ? nameWithoutCopy : `${nameWithoutCopy} Copy`,
                    "title",
                    this.props.leadGeneratorReports,
                ),
                order_by,
                top,
                filters,
            });
        }
        this.setState({ loading: false });
    }

    public render() {
        if (this.state.loading) {
            return (
                <LeadGeneratorAllLoader>
                    <LoaderLogo scale={1} />
                </LeadGeneratorAllLoader>
            );
        }
        return (
            <LeadGeneratorNewWrapper>
                <LeadGeneratorNewHeader>
                    <LeadGeneratorReturnLink
                        text="grow.lead_generator.page.my_reports"
                        link={this._swNavigator.href("leadGenerator.all")}
                    />
                </LeadGeneratorNewHeader>
                <ReportQuery
                    getPreviewData={this.getPreviewData}
                    onRunReport={this.onRunReport}
                    queryConfig={this._newReportConfig}
                    growContext={true}
                    {...this.state}
                />
            </LeadGeneratorNewWrapper>
        );
    }

    private getPreviewData = async (reportData) => {
        const previewData = await this._fetchService.post(
            "/api/lead-generator/query/preview",
            reportData,
        );
        return previewData;
    };

    private onRunReport = async (reportData) => {
        const queryData = await this._fetchService.post("/api/lead-generator/query", reportData);
        allTrackers.trackEvent(
            "add report",
            "submit-ok",
            `lead generation report/${queryData.result.queryId}`,
        );
        const runData = await this._fetchService.post(
            `/api/lead-generator/query/run/${queryData.result.queryId}`,
            {},
        );
        if (this._isComponentAlive) {
            this._swNavigator.go("leadGenerator.exist", {
                reportId: runData.queryId,
                runId: runData.runId,
            });
        }
        this.props.fetchReports();
    };
}

function mapStateToProps(store) {
    const { reports } = store.leadGenerator;
    return {
        leadGeneratorReports: reports,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchReports: () => {
            dispatch(fetchLeadGeneratorReports());
        },
    };
}

SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(LeadGeneratorNew),
    "LeadGeneratorNew",
);
