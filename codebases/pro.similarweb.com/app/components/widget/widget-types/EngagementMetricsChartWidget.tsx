/**
 * Created by liorb on 5/4/2017.
 */
import { swSettings } from "common/services/swSettings";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { WidgetState } from "components/widget/widget-types/Widget";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import {
    InfoIcon,
    LegendContainer,
    Styledlegend,
    Value,
} from "pages/website-analysis/components/dedupGraphConfig";
import { DeduplicationLockScreen } from "pages/website-analysis/components/deduplicationLockScreen";
import { useEffect, useState } from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { GraphWidget } from "./GraphWidget";
import widgetSettings from "components/dashboard/WidgetSettings";

export const LegendItems = ({ scope }) => {
    const [chartConfig, setChartConfig] = useState(null);
    useEffect(() => {
        scope.$watch("chartConfig.series.length", (newVal, oldVal) => {
            if (chartConfig !== scope.chartConfig) {
                setChartConfig(scope.chartConfig);
            }
        });
    }, [scope]);

    const [val, setVal] = useState({});

    function onToggleSeries(series) {
        series.visible = "visible" in series ? !series.visible : false;
        scope.$evalAsync(() => {
            setVal({});
        });
    }

    return (
        <FlexRow>
            {chartConfig &&
                chartConfig.series.map((series) => {
                    const isVisible = series.visible ?? true;
                    return (
                        <LegendContainer
                            isVisible={isVisible}
                            key={series.name}
                            onClick={() => onToggleSeries(series)}
                        >
                            <Styledlegend color={series.color} />
                            <Value>{i18nFilter()(series.text)}</Value>
                            <PlainTooltip placement={"top"} text={i18nFilter()(series.tooltip)}>
                                <span>
                                    <InfoIcon iconName="info" />
                                </span>
                            </PlainTooltip>
                        </LegendContainer>
                    );
                })}
        </FlexRow>
    );
};

export class EngagementMetricsChartWidget extends GraphWidget {
    public hideAddToDashboard: boolean;
    public reactWidgetComponent = DeduplicationLockScreen;
    public reactWidgetComponentProps = {};
    public reactLegendComponent: any;

    public static getWidgetMetadataType() {
        return "Graph";
    }

    public static getWidgetResourceType() {
        return "Graph";
    }

    public static getWidgetDashboardType() {
        return "Graph";
    }

    public getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.webSource =
            this._params.webSource === "Combined" ? "Total" : this._params.webSource;
        widgetModel.type = "Graph";
        return widgetModel;
    }

    public runWidget() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const widget = this;
        const engagementGaChartGranularityUtility = this.utilityGroups.find(
            ({ id }) => id === "engagement-ga-chart-granularity",
        );
        if (engagementGaChartGranularityUtility) {
            if (!widget._viewOptions.hasOwnProperty("frameClass")) {
                Object.defineProperty(widget._viewOptions, "frameClass", {
                    get() {
                        switch (widget.selectedTab) {
                            case "DedupUniqueUsers":
                                if (!widget.hasDedupPermission) {
                                    widget.viewOptions.showLegend = false;
                                    return `${widget.selectedTab} locked-metric`;
                                }
                                if (!widget.isDedupSupported()) {
                                    widget.viewOptions.showLegend = false;
                                    return `${widget.selectedTab} locked-metric`;
                                }

                            default:
                                return widget.selectedTab;
                        }
                    },
                });
            }
        }
        super.runWidget();
    }

    public callbackOnGetData(response: any, comparedItemKeys?: any[]): void {
        this._metricTypeConfig = widgetSettings.getMetricWidgetMetadata(
            this._widgetConfig.properties.metric,
            this._widgetConfig.properties.type,
            this._widgetConfig.properties.key.length > 1,
        );
        super.callbackOnGetData(response, comparedItemKeys);
        this.syncSeriesVisibility();
        const series = this?.chartConfig?.series;
        if (series && !this.isCompare()) {
            this.chartConfig.series = series.map(this.addLegendTextAndTooltip);
        }
    }

    public addLegendTextAndTooltip(item) {
        let text = "";
        let tooltip = "";
        switch (item.name) {
            case "Desktop":
                text = "tae.dedup.legend.desktop.text";
                tooltip = "tae.dedup.legend.desktop.tooltip";
                break;
            case "Mobile Web":
                text = "tae.dedup.legend.mobileweb.text";
                tooltip = "tae.dedup.legend.mobileweb.tooltip";
                break;
            case "Dedup":
                text = "tae.dedup.legend.dedup.text";
                tooltip = "tae.dedup.legend.dedup.tooltip";
                break;
        }
        return {
            ...item,
            text,
            tooltip,
        };
    }

    get hasDedupPermission() {
        return !swSettings.components.WebDebup.IsDisabled;
    }

    public isDedupSupported() {
        const dedupStartDate = dayjs(swSettings.components.WebDedup.resources.StartDate);
        const to = dayjs.utc(this.apiParams.to, "YYYY|MM|DD");
        const value = dayjs(to).isBefore(dedupStartDate);
        return !value;
    }

    public onTabSelected({ id }) {
        this.selectedTab = id;
        switch (id) {
            case "DedupUniqueUsers":
                if (this.hasDedupPermission) {
                    if (!this.isCompare()) {
                        if (this.isDedupSupported()) {
                            this.viewOptions.showLegend = true;
                            this.reactLegendComponent = LegendItems;
                        }
                    }
                    if (!this.isDedupSupported()) {
                        return false;
                    }
                    return true;
                }
                return false;

            default:
                this.viewOptions.showLegend = this.isCompare();
                this.reactLegendComponent = null;
                return true;
        }
    }

    get templateUrl() {
        const graphTemplate = "/app/components/widget/widget-templates/graph.html";
        const lockTemplate =
            "/app/components/widget/widget-templates/sw-react-widget-template.html";
        switch (this.selectedTab) {
            case "DedupUniqueUsers":
                if (!this.hasDedupPermission) {
                    return lockTemplate;
                }
                if (!this.isDedupSupported()) {
                    this.widgetState = WidgetState.ERROR;
                    this.handleDataError(401);
                }
        }
        return graphTemplate;
    }

    private syncSeriesVisibility() {
        this.chartConfig.series.forEach((serie) => {
            const legend: any = _.find(this.legendItems, { name: serie.name });
            if (legend) {
                serie.visible = !legend.hidden;
            }
        });
    }
}

EngagementMetricsChartWidget.register();
