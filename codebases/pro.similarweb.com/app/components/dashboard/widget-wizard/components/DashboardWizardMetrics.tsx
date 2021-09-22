import * as React from "react";
import * as _ from "lodash";
import { DropdownContainer } from "./DropdownContainer";
import { SimpleDropdownItem, DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import I18n from "components/React/Filters/I18n";
import { allTrackers } from "services/track/track";
import { i18nFilter } from "filters/ngFilters";
import widgetSettings from "components/dashboard/WidgetSettings";

export interface DashboardWizardMetricsProps {
    changeMetric: (metricId: string) => void;
    family: string;
    selectedMetric: string;
}

const DashboardWizardMetrics: React.StatelessComponent<DashboardWizardMetricsProps> = ({
    changeMetric,
    family,
    selectedMetric,
}) => {
    let selectedMetricId: number = 0;
    let metricItems: any = widgetSettings
        .getWidgetMetrics()
        .filter((metric) => metric.family === family && !metric.isDisabled)
        .map((metric, index) => {
            if (selectedMetric === metric.id) {
                selectedMetricId = index;
            }
            return {
                text: i18nFilter()(`dashboard.metricGallery.${metric.family}.${metric.id}.title`),
                metricId: metric.id,
                id: index,
                key: index,
            };
        });
    metricItems = _.sortBy(metricItems, (metric: any) => {
        return metric.text.toLowerCase();
    });
    const contents = [
        <DropdownButton key={Date.now()}>
            <I18n>metricItems[selectedMetricId].text</I18n>
        </DropdownButton>,
        ...metricItems,
    ];
    const onSelect = (item) => {
        allTrackers.trackEvent("Drop Down", "click", `Metric/${item.text}`);
        changeMetric(item.metricId);
    };

    return (
        <div className="metricType">
            <h4>
                <I18n>home.dashboards.wizard.metricType.title</I18n>
            </h4>
            <DropdownContainer
                initialSelection={{ [selectedMetricId]: true }}
                hasSearch={true}
                itemsComponent={SimpleDropdownItem}
                onSelect={onSelect}
                dropdownPopupHeight={150}
                searchPlaceHolder={`Search metric`}
            >
                {contents}
            </DropdownContainer>
        </div>
    );
};

SWReactRootComponent(DashboardWizardMetrics, "DashboardWizardMetrics");

export default DashboardWizardMetrics;
