import * as React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { ColumnsPickerModal } from "components/React/ColumnsPickerModal/ColumnsPickerModal";
import { i18nFilter } from "filters/ngFilters";
import { Component } from "react";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import LeadGeneratorTooltip from "../../components/LeadGeneratorTooltip";
import { NewResultsWrapper, ReportTableTopWrapper } from "./StyledComponents";
import { IReportTableTopProps, IReportTableTopState } from "../types";

class ReportTableTop extends Component<IReportTableTopProps, IReportTableTopState> {
    static defaultProps = {
        isSelectedExcludeUserLeads: true,
    };
    constructor(props) {
        super(props);
        this.state = {
            isColumnsPickerOpen: false,
            isSelectedNewResults: !!props.filtersStateObject.newLeadsOnly,
            isSelectedExcludeUserLeads: props.isSelectedExcludeUserLeads,
        };
    }

    private onSearch = (search) => {
        this.props.onFilterChange({ search }, true);
        allTrackers.trackEvent("Search Bar", "click", `Table/${search}`);
    };

    private onClickNewResultsCheckbox = () => {
        const isSelectedNewResults = !this.state.isSelectedNewResults;

        this.props.onFilterChange({ newLeadsOnly: isSelectedNewResults }, true);
        this.props.onChangeNewLeadsOnly && this.props.onChangeNewLeadsOnly(isSelectedNewResults);
        this.setState({ isSelectedNewResults });

        TrackWithGuidService.trackWithGuid(
            "workspaces.sales.saved_searches.checkbox.new-results",
            "click",
            {
                value: isSelectedNewResults ? "check" : "uncheck",
            },
        );
    };

    private onClickExcludeUserLeadsCheckbox = () => {
        const isSelectedExcludeUserLeads = !this.state.isSelectedExcludeUserLeads;
        this.props.onFilterChange({ excludeUserLeads: isSelectedExcludeUserLeads }, true);
        this.props.onChangeExcludeLeads &&
            this.props.onChangeExcludeLeads(isSelectedExcludeUserLeads);
        this.setState({ isSelectedExcludeUserLeads });

        TrackWithGuidService.trackWithGuid(
            "workspaces.sales.saved_searches.checkbox.exclude_leads",
            "click",
            {
                value: isSelectedExcludeUserLeads ? "check" : "uncheck",
            },
        );
    };

    private onCancelColumnsPicker = () => {
        this.setState({ isColumnsPickerOpen: false });
        allTrackers.trackEvent("Drop down", "close", "lead generation reports/edit_columns");
    };

    private onApplyColumnsPicker = (groupsColumns) => {
        this.setState({ isColumnsPickerOpen: false });
        this.props.onClickToggleColumns(groupsColumns.map((column) => column.visible));
    };

    private openColumnPicker = () => {
        this.setState({ isColumnsPickerOpen: true });
        allTrackers.trackEvent("Drop down", "open", "lead generation reports/edit_columns");
    };

    render() {
        const { withExcelExport, renderExcelExportButton, filtersStateObject } = this.props;

        return (
            <ReportTableTopWrapper>
                <SearchInput
                    defaultValue={this.props.filtersStateObject.search}
                    debounce={400}
                    onChange={this.onSearch}
                    placeholder={i18nFilter()("grow.lead_generator.wizard.step2.search")}
                />
                {this.props.isNewResultsCheckboxVisible && (
                    <NewResultsWrapper data-automation="wrapper-check-box-new-result">
                        <Checkbox
                            label={i18nFilter()(
                                "grow.lead_generator.wizard.step2.checkbox.label.new-results",
                            )}
                            onClick={this.onClickNewResultsCheckbox}
                            selected={this.state.isSelectedNewResults}
                        />
                    </NewResultsWrapper>
                )}
                {this.props.isExcludeUserLeadsCheckboxVisible && (
                    <NewResultsWrapper data-automation="wrapper-check-box-excluding-domains">
                        <Checkbox
                            label={i18nFilter()(
                                "grow.lead_generator.wizard.step2.checkbox.label.excluding-domains",
                            )}
                            onClick={this.onClickExcludeUserLeadsCheckbox}
                            selected={this.state.isSelectedExcludeUserLeads}
                        />
                    </NewResultsWrapper>
                )}
                <LeadGeneratorTooltip
                    text={i18nFilter()("grow.lead_generator.exist.table.columns_settings")}
                >
                    <IconButton iconName="columns" type="flat" onClick={this.openColumnPicker} />
                </LeadGeneratorTooltip>
                {withExcelExport &&
                    renderExcelExportButton &&
                    renderExcelExportButton(filtersStateObject as any)}
                <ColumnsPickerModal
                    isOpen={this.state.isColumnsPickerOpen}
                    onCancelClick={this.onCancelColumnsPicker}
                    onApplyClick={this.onApplyColumnsPicker}
                    groupsData={this.props.tableToggleGroups}
                    showRestore={true}
                    storageKey={"lg_workspace_wizard"}
                    defaultColumnsData={this.props.defaultTableColumns}
                    columnsData={this.props.tableColumns}
                />
            </ReportTableTopWrapper>
        );
    }
}

export default ReportTableTop;
