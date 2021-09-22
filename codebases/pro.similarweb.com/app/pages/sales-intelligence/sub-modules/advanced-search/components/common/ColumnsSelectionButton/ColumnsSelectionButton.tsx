import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledButtonContainer } from "./styles";

type ColumnsSelectionButtonProps = {
    tooltipText?: string;
    onClick(): void;
};

const ColumnsSelectionButton = (props: ColumnsSelectionButtonProps) => {
    const translate = useTranslation();
    const {
        onClick,
        tooltipText = translate("si.components.table_columns_selection.button.tooltip"),
    } = props;

    return (
        <StyledButtonContainer>
            <PlainTooltip tooltipContent={tooltipText}>
                <div>
                    <IconButton
                        type="flat"
                        iconSize="sm"
                        onClick={onClick}
                        iconName="columns"
                        dataAutomation="columns-selection-trigger-button"
                    />
                </div>
            </PlainTooltip>
        </StyledButtonContainer>
    );
};

export default ColumnsSelectionButton;
