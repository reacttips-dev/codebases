import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { Label } from "@similarweb/ui-components/dist/textfield";
import React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { i18nFilter } from "../../../filters/ngFilters";
import { IOpportunityListItemAlertsConfig } from "./types";
import { LabelsWrapper, MetricsContainer } from "./styles";

export interface IListFeedTabProps {
    onEditFeedCountriesClicked: () => void;
    onFeedMetricsChanged: (metrics: string[]) => void;
    feedSettings: IOpportunityListItemAlertsConfig;
}

export const ListFeedTab: React.FunctionComponent<IListFeedTabProps> = ({
    onFeedMetricsChanged,
    feedSettings,
}) => {
    const isTotalVisitsEnabled = feedSettings.metrics.includes("monthly_total_visits_change");
    const isMmxEnabled = feedSettings.metrics.includes("desktop_mmx_outlier_change");
    const isNewsEnabled = feedSettings.metrics.includes("news");
    const onEnabledMetricClicked = (metric) => {
        const isActive = feedSettings.metrics.includes(metric);
        if (isActive) {
            onFeedMetricsChanged(feedSettings.metrics.filter((item) => item !== metric));
        } else {
            onFeedMetricsChanged(feedSettings.metrics.concat(metric));
        }
        TrackWithGuidService.trackWithGuid("workspace_list_settings_toggle_metric", "switch", {
            metric,
            state: isActive ? "off" : "on",
        });
    };
    return (
        <div>
            <LabelsWrapper>
                <Label>{i18nFilter()("workspaces.settings.feed.tab.title")}</Label>
            </LabelsWrapper>
            <MetricsContainer>
                <span>{i18nFilter()("workspaces.settings.feed.tab.metrics.total_visits")}</span>
                <OnOffSwitch
                    isSelected={isTotalVisitsEnabled}
                    onClick={() => onEnabledMetricClicked("monthly_total_visits_change")}
                />
            </MetricsContainer>
            <MetricsContainer>
                <span>{i18nFilter()("workspaces.settings.feed.tab.metrics.mmx")}</span>
                <OnOffSwitch
                    isSelected={isMmxEnabled}
                    onClick={() => onEnabledMetricClicked("desktop_mmx_outlier_change")}
                />
            </MetricsContainer>
            <LabelsWrapper>
                <Label>{i18nFilter()("workspaces.settings.feed.tab.metrics.news.label")}</Label>
            </LabelsWrapper>
            <MetricsContainer>
                <span>{i18nFilter()("workspaces.settings.feed.tab.metrics.news")}</span>
                <OnOffSwitch
                    isSelected={isNewsEnabled}
                    onClick={() => onEnabledMetricClicked("news")}
                />
            </MetricsContainer>
        </div>
    );
};
