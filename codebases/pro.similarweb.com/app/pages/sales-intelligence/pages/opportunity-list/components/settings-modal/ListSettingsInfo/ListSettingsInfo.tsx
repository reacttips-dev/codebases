import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { LIST_SETTINGS_MODAL_KEY } from "../../../../../constants/translations";
import {
    StyledSettingsInfo,
    StyledLabel,
    StyledDeleteSection,
    StyledNameEditSection,
} from "../styles";
import ListSettingsFeed from "../ListSettingsFeed/ListSettingsFeed";
import { AlertsSettings } from "pages/sales-intelligence/sub-modules/opportunities/types";

type ListSettingsInfoProps = {
    listName: string;
    listDeleting: boolean;
    metrics: AlertsSettings["metrics"];
    onDeleteClick(): void;
    onMetricToggle(metric: string): void;
    onListNameChange(name: string): void;
};

const ListSettingsInfo = (props: ListSettingsInfoProps) => {
    const translate = useTranslation();
    const {
        metrics,
        listName,
        listDeleting,
        onDeleteClick,
        onListNameChange,
        onMetricToggle,
    } = props;

    return (
        <StyledSettingsInfo>
            <StyledNameEditSection>
                <StyledLabel>
                    <span>{translate(`${LIST_SETTINGS_MODAL_KEY}.label.name`)}</span>
                </StyledLabel>
                <Textfield
                    autoFocus
                    maxLength={100}
                    defaultValue={listName}
                    onChange={onListNameChange}
                    dataAutomation="list-settings-modal-title-text-field"
                    placeholder={translate(`${LIST_SETTINGS_MODAL_KEY}.name.placeholder`)}
                />
            </StyledNameEditSection>
            <ListSettingsFeed metrics={metrics} onToggle={onMetricToggle} />
            <StyledLabel>
                <span>{translate(`${LIST_SETTINGS_MODAL_KEY}.label.delete`)}</span>
            </StyledLabel>
            <StyledDeleteSection>
                <p>{translate(`${LIST_SETTINGS_MODAL_KEY}.delete_text`)}</p>
                <Button
                    type="flatWarning"
                    onClick={onDeleteClick}
                    isLoading={listDeleting}
                    isDisabled={listDeleting}
                    dataAutomation="list-settings-modal-delete-button"
                >
                    {translate(`${LIST_SETTINGS_MODAL_KEY}.button.delete`)}
                </Button>
            </StyledDeleteSection>
        </StyledSettingsInfo>
    );
};

export default ListSettingsInfo;
