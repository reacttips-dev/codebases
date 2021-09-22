import { AutosizeInput } from "@similarweb/ui-components/dist/autosize-input";

import {
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";

import { IconButton } from "@similarweb/ui-components/dist/button";

import { TitlePlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";

import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { Component } from "react";
import { allTrackers } from "services/track/track";
import LeadGeneratorSubtitleBox from "../../components/LeadGeneratorSubtitleBox";
import LeadGeneratorUtils from "../../LeadGeneratorUtils";
import {
    LeadGeneratorExistHeader,
    LeadGeneratorExistHeaderWrapper,
    LeadGeneratorExistLoaderWrapper,
    LeadGeneratorSubtitleWrapper,
    RunsDropdownContainer,
} from "./elements";
import { ReportResultsWarning } from "../../lead-generator-wizard/components/StyledComponents";
import { SWReactIcons } from "@similarweb/icons";
import I18n from "../../../../components/React/Filters/I18n";

interface IReportHeaderProps {
    onClickReportRun: (click) => void;
    reportName: string;
    top: number;
    order_by: string;
    reportFilters: any;
    reportRuns: any[];
    selectedRun: any;
    requestTime: string;
    onChangeReportName: (name) => void;
    copyLink: string;
    isDesktopOnlyReport: boolean;
}

interface IReportHeaderState {
    tmpName: string;
}

class ReportHeader extends Component<IReportHeaderProps, IReportHeaderState> {
    public static getDerivedStateFromProps(props, state) {
        if (props.reportName !== state.tmpName) {
            return {
                tmpName: props.reportName,
            };
        }

        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            tmpName: props.reportName,
        };
    }

    private onApplyReportTitle = () => {
        if (LeadGeneratorUtils.isReportNameValid(this.state.tmpName)) {
            this.props.onChangeReportName(this.state.tmpName);
        } else {
            this.setState({ tmpName: this.props.reportName });
        }
    };

    private getAvailableReportRuns() {
        return this.props.reportRuns.map((run) => ({
            id: run.id.toString(),
            text: LeadGeneratorUtils.formatReportPeriod(run.requestTime),
            requestTime: run.requestTime,
        }));
    }

    private onToggle = (isOpen) => {
        const state = isOpen ? "open" : "close";
        allTrackers.trackEvent("Drop down", state, "Table/dates list");
    };

    public render() {
        return (
            <LeadGeneratorExistHeader>
                {this.props.reportFilters.countries.length === 0 &&
                this.props.reportFilters.categories.length === 0 ? (
                    <LeadGeneratorExistLoaderWrapper>
                        <TitlePlaceholderLoader />
                    </LeadGeneratorExistLoaderWrapper>
                ) : (
                    <LeadGeneratorExistHeaderWrapper>
                        <AutosizeInput
                            placeholder={i18nFilter()(
                                "grow.lead_generator.new.report_name.placeholder",
                            )}
                            onChange={(event) => this.setState({ tmpName: event.target.value })}
                            onApply={this.onApplyReportTitle}
                            onCancel={() => this.setState({ tmpName: this.props.reportName })}
                            value={this.state.tmpName}
                            maxLength={LeadGeneratorUtils.REPORT_NAME_MAX_LENGTH}
                        />
                        <LeadGeneratorSubtitleWrapper>
                            <LeadGeneratorSubtitleBox
                                filters={LeadGeneratorUtils.getBoxSubtitleFilters(
                                    this.props.top,
                                    this.props.order_by,
                                    this.props.reportFilters,
                                )}
                            />
                            <a href={this.props.copyLink}>
                                <IconButton type="flat" iconName="copy">
                                    {i18nFilter()("grow.lead_generator.all.report.copy")}
                                </IconButton>
                            </a>
                        </LeadGeneratorSubtitleWrapper>
                        {this.props.isDesktopOnlyReport && (
                            <ReportResultsWarning>
                                <SWReactIcons iconName="warning" size="sm" />
                                <I18n>
                                    grow.lead_generator.wizard.desktop_countries_warning.results
                                </I18n>
                            </ReportResultsWarning>
                        )}
                        {this.props.requestTime && (
                            <RunsDropdownContainer>
                                <Dropdown
                                    selectedIds={this.props.selectedRun}
                                    itemsComponent={SimpleDropdownItem}
                                    onClick={this.props.onClickReportRun}
                                    closeOnItemClick={false}
                                    buttonWidth="auto"
                                    onToggle={this.onToggle}
                                >
                                    {[
                                        <DropdownButton key="CountryButton1" width={200}>
                                            {LeadGeneratorUtils.formatReportPeriod(
                                                this.props.requestTime,
                                            )}
                                        </DropdownButton>,
                                        ...this.getAvailableReportRuns(),
                                    ]}
                                </Dropdown>
                            </RunsDropdownContainer>
                        )}
                    </LeadGeneratorExistHeaderWrapper>
                )}
            </LeadGeneratorExistHeader>
        );
    }
}

export default ReportHeader;
