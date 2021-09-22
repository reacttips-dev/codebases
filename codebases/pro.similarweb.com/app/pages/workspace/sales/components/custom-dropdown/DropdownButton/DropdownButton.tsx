import React from "react";
import {
    NoBorderButtonWrap,
    SimpleChipItemWrap,
} from "@similarweb/ui-components/dist/dropdown/src/chipdown/ChipdownStyles";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { DISABLE_TOOLTIP_VALUE } from "@similarweb/ui-components/dist/chip/src/ChipItemBasic";

type DropdownButtonProps = {
    disabled?: boolean;
    buttonText: string;
    selectedText: string | null;
    tooltipText?: string;
    onClose(): void;
    onClick(): void;
};

const DropdownButton: React.FC<DropdownButtonProps> = ({
    disabled = false,
    buttonText,
    selectedText,
    tooltipText,
    onClick,
    onClose,
}) => {
    const handleClose = React.useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onClose();
        },
        [onClose],
    );

    function handleClick() {
        if (disabled) {
            return;
        }

        onClick();
    }

    function renderButton() {
        return (
            <div onClick={handleClick}>
                <NoBorderButtonWrap disabled={disabled}>{buttonText}</NoBorderButtonWrap>
            </div>
        );
    }

    if (!selectedText) {
        if (tooltipText) {
            return (
                <PlainTooltip maxWidth={170} placement="top" tooltipContent={tooltipText}>
                    {renderButton()}
                </PlainTooltip>
            );
        }

        return renderButton();
    }

    return (
        <div onClick={handleClick}>
            <SimpleChipItemWrap
                text={selectedText}
                onCloseItem={handleClose}
                displayTooltipForTextLongerThan={DISABLE_TOOLTIP_VALUE}
            />
        </div>
    );
};

export default React.memo(DropdownButton);
