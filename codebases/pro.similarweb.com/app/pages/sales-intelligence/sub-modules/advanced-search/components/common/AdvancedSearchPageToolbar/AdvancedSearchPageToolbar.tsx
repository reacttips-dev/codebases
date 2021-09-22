import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { StyledTitle, StyledToolbar } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";

type AdvancedSearchPageToolbarProps = {
    title: string;
    isSavedSearchesButtonDisabled: boolean;
    onSettingsClick?(): void;
    onManageSavedSearchesClick(): void;
    onNewSearchClick(): void;
};

const AdvancedSearchPageToolbar = (props: AdvancedSearchPageToolbarProps) => {
    const translate = useTranslation();
    const {
        title,
        isSavedSearchesButtonDisabled,
        onManageSavedSearchesClick,
        onNewSearchClick,
        onSettingsClick,
    } = props;

    return (
        <StyledToolbar>
            <StyledTitle>{title}</StyledTitle>
            {typeof onSettingsClick === "function" && (
                <PlainTooltip
                    tooltipContent={translate("si.advanced_search.toolbar.settings.button.tooltip")}
                >
                    <div>
                        <IconButton
                            type="flat"
                            iconName="settings"
                            onClick={onSettingsClick}
                            dataAutomation="saved-search-settings-button"
                        />
                    </div>
                </PlainTooltip>
            )}
            <div>
                <IconButton
                    type="flat"
                    iconSize="xs"
                    iconName="aim-icon"
                    onClick={onManageSavedSearchesClick}
                    dataAutomation="saved-searches-button"
                    isDisabled={isSavedSearchesButtonDisabled}
                >
                    {translate("si.pages.lead_gen.toolbar.button.saved_searches")}
                </IconButton>
            </div>
            <div>
                <IconButton
                    type="flat"
                    iconSize="xs"
                    iconName="light-bulb"
                    dataAutomation="new-search-button"
                    onClick={onNewSearchClick}
                >
                    {translate("si.pages.lead_gen.toolbar.button.new_search")}
                </IconButton>
            </div>
        </StyledToolbar>
    );
};

export default AdvancedSearchPageToolbar;
