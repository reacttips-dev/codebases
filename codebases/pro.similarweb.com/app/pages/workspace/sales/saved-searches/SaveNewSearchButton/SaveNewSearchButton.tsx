import React from "react";
import {
    SAVE_SEARCH_TOOLTIP_MAX_WIDTH,
    SAVE_SEARCH_TOOLTIP_TEXT,
    SAVE_SEARCH_BUTTON_TEXT,
} from "../../constants/constants";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { IconButton, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { StyledSaveNewSearchTooltipText } from "./styles";

export type SaveNewSearchButtonProps = {
    disabled?: boolean;
    loading?: boolean;
    onClick(): void;
};

const SaveNewSearchButton: React.FC<SaveNewSearchButtonProps> = ({
    onClick,
    disabled = false,
    loading = false,
}) => {
    const translate = useTranslation();

    function renderTooltipContent() {
        return (
            <StyledSaveNewSearchTooltipText>
                {translate(SAVE_SEARCH_TOOLTIP_TEXT)}
            </StyledSaveNewSearchTooltipText>
        );
    }

    return (
        <PlainTooltip
            placement="bottom"
            tooltipContent={renderTooltipContent()}
            maxWidth={SAVE_SEARCH_TOOLTIP_MAX_WIDTH}
        >
            <div>
                {/* <div/> is required for tooltip to work :( */}
                <IconButton
                    type="primary"
                    iconName="save"
                    onClick={onClick}
                    isLoading={loading}
                    isDisabled={disabled}
                >
                    <ButtonLabel>{translate(SAVE_SEARCH_BUTTON_TEXT)}</ButtonLabel>
                </IconButton>
            </div>
        </PlainTooltip>
    );
};

export default SaveNewSearchButton;
