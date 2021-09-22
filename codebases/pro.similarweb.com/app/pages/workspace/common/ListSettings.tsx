import React from "react";
import { Label, Textfield } from "@similarweb/ui-components/dist/textfield";
import Alert from "pages/sneakpeek/components/Alert";
import { Button } from "@similarweb/ui-components/dist/button";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import {
    AlertBoxContainer,
    DangerZoneContent,
    LabelsWrapper,
    StyledListSettingsTextFieldContainer,
    StyledListSettingsMetricsContainer,
} from "pages/workspace/common/styles";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { i18nFilter } from "filters/ngFilters";
import { IOpportunityListItemAlertsConfig } from "pages/workspace/common/types";

type ListSettingsProps = {
    namePlaceHolder: string;
    listName?: string;
    error: boolean;
    mode: string;
    onDelete(e: Event): void;
    onListNameChanged(name: string): void;
    onFeedMetricsChanged(metrics: string[]): void;
    feedSettings: IOpportunityListItemAlertsConfig;
};

export const ListSettings: React.FC<ListSettingsProps> = ({
    namePlaceHolder,
    listName,
    error,
    mode,
    onDelete,
    onListNameChanged,
    onFeedMetricsChanged,
    feedSettings,
}) => {
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
            state: isActive ? "off" : `on`,
        });
    };
    return (
        <>
            <StyledListSettingsTextFieldContainer>
                <Textfield
                    label={i18nFilter()("workspaces.sales.opportunity-lists.edit.title")}
                    defaultValue={listName}
                    onChange={onListNameChanged}
                    error={error}
                    errorMessage={i18nFilter()(
                        "workspaces.investors.opportunity-lists.edit.title.error",
                    )}
                    placeholder={namePlaceHolder}
                    maxLength={100}
                    dataAutomation="list-settings-modal-title-text-field"
                />
            </StyledListSettingsTextFieldContainer>
            <LabelsWrapper>
                <Label>{i18nFilter()("workspaces.settings.feed.tab.metrics.news.label")}</Label>
            </LabelsWrapper>
            <StyledListSettingsMetricsContainer>
                <span>{i18nFilter()("workspaces.sales.settings.list.metrics.news")}</span>
                <OnOffSwitch
                    isSelected={isNewsEnabled}
                    onClick={() => onEnabledMetricClicked("news")}
                />
            </StyledListSettingsMetricsContainer>
            {mode === "edit" && (
                <AlertBoxContainer>
                    <Label>Danger zone</Label>
                    <Alert
                        text={
                            <DangerZoneContent>
                                <span>
                                    {i18nFilter()(
                                        "workspaces.investors.opportunity-lists.delete.text",
                                    )}
                                </span>
                                <Button
                                    onClick={onDelete}
                                    type="flatWarning"
                                    dataAutomation="list-settings-modal-delete-button"
                                    buttonHtmlType="button"
                                >
                                    {i18nFilter()(
                                        "workspaces.investors.opportunity-lists.delete.button",
                                    )}
                                </Button>
                            </DangerZoneContent>
                        }
                    />
                </AlertBoxContainer>
            )}
        </>
    );
};

export default ListSettings;
