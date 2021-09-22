import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import I18n from "components/React/Filters/I18n";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import React from "react";
import DurationService from "services/DurationService";

const EarliestMMXWindowStartDate = "2017/10/01";

export class MmxDashboardWidgetFilters extends InjectableComponent {
    protected i18n;
    protected selectedFilters: any = {};
    private granularityDisabled: boolean;
    private widgetDuration: any;

    constructor(props) {
        super(props);
        this.i18n = this.injector.get("i18nFilter");
        this.selectedFilters = {
            filter: this.props.widgetFilters.filter,
            timeGranularity: this.props.widgetFilters.timeGranularity || "Monthly",
        };
        this.props.changeFilter(this.getSelectedFilters());
        this.granularityDisabled = this.isGranularityDisabled({
            widgetDuration: this.props.widgetDuration,
        });
    }

    public render() {
        return (
            <div key="dynamicFiltersContainer" className="filters">
                <div key="timeGranularityFilter" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.TimeGranularity`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="timeGranularity"
                        items={[
                            {
                                key: "Daily",
                                id: "Daily",
                                text: "Daily",
                                disabled: this.granularityDisabled,
                            },
                            {
                                key: "Weekly",
                                id: "Weekly",
                                text: "Weekly",
                                disabled: this.granularityDisabled,
                            },
                            { key: "Monthly", id: "Monthly", text: "Monthly" },
                        ]}
                        selectedId={this.selectedFilters.timeGranularity}
                        onSelect={this.onSelectTimeGranularity}
                    />
                </div>
            </div>
        );
    }

    public componentDidUpdate(prevProps) {
        if (prevProps.widgetDuration !== this.props.widgetDuration) {
            this.granularityDisabled = this.isGranularityDisabled({
                widgetDuration: this.props.widgetDuration,
            });
            if (this.granularityDisabled) {
                this.selectedFilters.timeGranularity = "Monthly";
                this.props.changeFilter(this.getSelectedFilters());
            }
        }
    }

    private isGranularityDisabled({ widgetDuration }) {
        widgetDuration = DurationService.getDurationData(widgetDuration);
        return widgetDuration.raw.from.isBefore(new Date(EarliestMMXWindowStartDate));
    }

    private getSelectedFilters() {
        return Object.entries(this.selectedFilters).map(([name, value]) => ({ name, value }));
    }

    private onSelectTimeGranularity = (item) => {
        this.selectedFilters.timeGranularity = item.id;
        this.props.changeFilter(this.getSelectedFilters());
    };
}
