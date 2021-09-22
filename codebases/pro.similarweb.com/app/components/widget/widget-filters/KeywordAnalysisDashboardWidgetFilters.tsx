import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import I18n from "components/React/Filters/I18n";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import React from "react";
import DurationService from "services/DurationService";

const EarliestDailyKeywordsDate = "2018/12/01";

export class KeywordAnalysisDashboardWidgetFilters extends InjectableComponent {
    protected i18n;
    protected selectedFilters: any = {};
    private granularityDisabled: boolean;
    private widgetDuration: any;

    constructor(props) {
        super(props);
        this.i18n = this.injector.get("i18nFilter");
        let selectedSites;

        //adding sites to api filter from existing filters or from records
        if (this.props.widgetFilters.sites) {
            selectedSites = this.props.widgetFilters.sites;
        } else if (this.props.widgetPreview.Records) {
            selectedSites = this.props.widgetPreview.Records.map((record) => {
                return record.Domain;
            }).join();
        }

        this.selectedFilters = {
            filter: this.props.widgetFilters.filter,
            sites: selectedSites,
            timeGranularity: this.props.widgetFilters.timeGranularity || "Monthly",
            shareType: this.props.widgetFilters.shareType || "RelativeShare",
        };
        this.props.changeFilter(this.getSelectedFilters());
        this.granularityDisabled = this.isGranularityDisabled({
            widgetDuration: this.props.widgetDuration,
        });
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

    public render() {
        return (
            <div key="dynamicFiltersContainer" className="filters">
                <div key="timeGranularityFilter" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.traffictype`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="shareType"
                        items={[
                            { key: "RelativeShare", id: "RelativeShare", text: "Traffic Trend" },
                            { key: "Share", id: "Share", text: "Market Share" },
                        ]}
                        selectedId={this.selectedFilters.shareType}
                        onSelect={this.onSelectShareType}
                    />
                </div>
            </div>
        );
    }

    private isGranularityDisabled({ widgetDuration }) {
        widgetDuration = DurationService.getDurationData(widgetDuration);
        return widgetDuration.raw.from.isBefore(new Date(EarliestDailyKeywordsDate));
    }

    private getSelectedFilters() {
        return Object.entries(this.selectedFilters).map(([name, value]) => ({ name, value }));
    }

    private onSelectTimeGranularity = (item) => {
        this.selectedFilters.timeGranularity = item.id;
        this.props.changeFilter(this.getSelectedFilters());
    };

    private onSelectShareType = (item) => {
        this.selectedFilters.shareType = item.id;
        this.props.changeFilter(this.getSelectedFilters());
    };
}
