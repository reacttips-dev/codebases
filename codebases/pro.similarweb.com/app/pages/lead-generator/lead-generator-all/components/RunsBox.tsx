import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import {
    LeadGeneratorAllBox,
    RunsBoxHeader,
    RunsBoxHeaderTitle,
    RunsBoxHeaderSubtitle,
    UnarchiveButton,
} from "./elements";
import RunsTable from "./RunsTable";
import { i18nFilter } from "filters/ngFilters";
import RenameReportModal from "../../dialogs/RenameReportModal";
import { Injector } from "common/ioc/Injector";
import LeadGeneratorRunButton from "../../components/LeadGeneratorRunButton";
import ReportActionsEllipsis from "./ReportActionsEllipsis";
import ToggleBoxButton from "./ToggleBoxButton";
import ReportTitle from "./ReportTitle";
import { allTrackers } from "services/track/track";
import RunReportModal from "../../dialogs/RunReportModal";
import LeadGeneratorUtils from "../../LeadGeneratorUtils";
import * as numeral from "numeral";
import {
    updateLeadGeneratorReportName,
    IUpdateReport,
    archiveLeadGeneratorReport,
    unarchiveLeadGeneratorReport,
} from "actions/leadGeneratorActions";
import LeadGeneratorSubtitleBox from "../../components/LeadGeneratorSubtitleBox";
import UIComponentStateService from "services/UIComponentStateService";
import { SWReactIcons } from "@similarweb/icons";
import LeadGeneratorTooltip from "../../components/LeadGeneratorTooltip";
import { IconButton } from "@similarweb/ui-components/dist/button";

interface IRunsBoxProps {
    report: any;
    onRunReport: (string) => void;
    updateReportName: (report: IUpdateReport) => void;
    archiveReport: (report: IUpdateReport) => void;
    unarchiveReport: (report: IUpdateReport) => void;
    reportNameLoading: boolean;
}

interface IRunsBoxState {
    isOpen: boolean;
    isRenameModalOpen: boolean;
    isRunModalOpen: boolean;
}

class RunsBox extends Component<IRunsBoxProps, IRunsBoxState> {
    private _swNavigator = Injector.get("swNavigator") as any;
    private _localStorageId;

    constructor(props) {
        super(props);

        this._localStorageId = `leadgenerator_report_box_${props.report.queryDefinition.id}`;

        this.state = {
            isOpen:
                UIComponentStateService.getItem(this._localStorageId, "localStorage", true) !==
                "false",
            isRenameModalOpen: false,
            isRunModalOpen: false,
        };
    }

    public render() {
        return (
            <LeadGeneratorAllBox data-automation="lead-generator-report-box">
                <RunsBoxHeader>
                    <RunsBoxHeaderTitle>
                        <ToggleBoxButton
                            isOpen={this.state.isOpen}
                            onClickToggle={this.onToggleBox}
                        />
                        <ReportTitle
                            reportName={this.props.report.queryDefinition.name}
                            isNameLoading={
                                this.props.reportNameLoading ===
                                this.props.report.queryDefinition.id
                            }
                            newDataAvailable={this.props.report.newDataAvailable}
                        />
                        {this.props.report.queryDefinition.status === 0 && (
                            <LeadGeneratorRunButton
                                isDisabled={!this.props.report.newDataAvailable}
                                onClick={() => this.setState({ isRunModalOpen: true })}
                                tooltipText={i18nFilter()(
                                    "grow.lead_generator.all.report.run.tooltip",
                                )}
                                buttonText={i18nFilter()("grow.lead_generator.all.report.run")}
                            />
                        )}
                        {this.props.report.queryDefinition.status === 0 ? (
                            <ReportActionsEllipsis
                                onClickRename={this.onClickRename}
                                onClickCopy={this.onClickCopy}
                                onClickArchive={this.onClickArchive}
                                onToggleEllipsis={this.onToggleEllipsis}
                            />
                        ) : (
                            <UnarchiveButton>
                                <IconButton
                                    type="flat"
                                    iconName="unarchive"
                                    onClick={this.onClickUnarchive}
                                >
                                    {i18nFilter()("grow.lead_generator.sidenav.action.unarchive")}
                                </IconButton>
                            </UnarchiveButton>
                        )}
                    </RunsBoxHeaderTitle>
                    <RunsBoxHeaderSubtitle>
                        <LeadGeneratorSubtitleBox
                            filters={LeadGeneratorUtils.getBoxSubtitleFilters(
                                this.props.report.queryDefinition.top,
                                this.props.report.queryDefinition.order_by,
                                this.props.report.queryDefinition.filters,
                            )}
                        />
                        <LeadGeneratorTooltip
                            text={i18nFilter()("grow.lead_generator.all.report.copy")}
                        >
                            <a onClick={this.onClickCopy}>
                                <SWReactIcons iconName="copy" />
                            </a>
                        </LeadGeneratorTooltip>
                    </RunsBoxHeaderSubtitle>
                </RunsBoxHeader>
                {this.state.isOpen && (
                    <RunsTable
                        reportRuns={this.props.report.runs}
                        reportId={this.props.report.queryDefinition.id}
                    />
                )}
                <RenameReportModal
                    isOpen={this.state.isRenameModalOpen}
                    reportName={this.props.report.queryDefinition.name}
                    reportId={this.props.report.queryDefinition.id}
                    onRequestClose={() => this.setState({ isRenameModalOpen: false })}
                    onClickDone={this.onSubmitNewName}
                />
                <RunReportModal
                    isOpen={this.state.isRunModalOpen}
                    reportName={this.props.report.queryDefinition.name}
                    reportDate={LeadGeneratorUtils.getComponentDate()}
                    reportMaxResults={numeral(this.props.report.queryDefinition.top)
                        .format("0,0")
                        .toString()}
                    reportGroupResults={numeral(this.getGroupSitesCalc()).format("0,0").toString()}
                    onClickClose={() => this.setState({ isRunModalOpen: false })}
                    onClickDone={() => this.props.onRunReport(this.props.report.queryDefinition.id)}
                />
            </LeadGeneratorAllBox>
        );
    }

    private onToggleBox = () => {
        UIComponentStateService.setItem(
            this._localStorageId,
            "localStorage",
            JSON.stringify(!this.state.isOpen),
            true,
        );
        this.setState({ isOpen: !this.state.isOpen });
    };

    private onSubmitNewName = (newName) => {
        this.setState({ isRenameModalOpen: false });
        this.props.updateReportName({
            reportId: this.props.report.queryDefinition.id,
            reportName: newName,
        });
        allTrackers.trackEvent(
            "report Settings",
            "submit-ok",
            `${this.props.report.queryDefinition.id}/rename/${newName}`,
        );
    };

    private onClickRename = () => {
        allTrackers.trackEvent(
            "report Settings",
            "click",
            `${this.props.report.queryDefinition.id}/rename`,
        );
        this.setState({ isRenameModalOpen: true });
    };

    private onClickCopy = () => {
        allTrackers.trackEvent(
            "report Settings",
            "click",
            `${this.props.report.queryDefinition.id}/create a copy`,
        );
        this._swNavigator.go("leadGenerator.edit", {
            reportId: this.props.report.queryDefinition.id,
        });
    };

    private onClickArchive = () => {
        allTrackers.trackEvent(
            "report Settings",
            "click",
            `${this.props.report.queryDefinition.id}/archive`,
        );
        this.props.archiveReport({
            reportId: this.props.report.queryDefinition.id,
            reportName: this.props.report.queryDefinition.name,
        });
    };

    private onClickUnarchive = () => {
        allTrackers.trackEvent(
            "report Settings",
            "click",
            `${this.props.report.queryDefinition.id}/unarchive`,
        );
        this.props.unarchiveReport({
            reportId: this.props.report.queryDefinition.id,
            reportName: this.props.report.queryDefinition.name,
        });
    };

    private onToggleEllipsis = (isOpen) => {
        const state = isOpen ? "open" : "close";
        allTrackers.trackEvent("report Settings", state, this.props.report.queryDefinition.id);
    };

    private getGroupSitesCalc() {
        return LeadGeneratorUtils.getGroupSitesCalc(
            this.props.report.queryDefinition.filters.countries,
            this.props.report.queryDefinition.filters.categories.length,
            this.props.report.queryDefinition.top,
        );
    }
}

function mapStateToProps(store) {
    const { reportNameLoading } = store.leadGenerator;
    return {
        reportNameLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateReportName: (report: IUpdateReport) =>
            dispatch(updateLeadGeneratorReportName(report)),
        archiveReport: (report: IUpdateReport) => dispatch(archiveLeadGeneratorReport(report)),
        unarchiveReport: (report: IUpdateReport) => dispatch(unarchiveLeadGeneratorReport(report)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RunsBox);
