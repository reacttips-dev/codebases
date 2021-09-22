import React from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Button } from "@similarweb/ui-components/dist/button";
import { StyledSubmitButton } from "./styles";

type OptionButtonProps = {
    onClick(): void;
    label: string;
    isDisabled?: boolean;
    isLoading: boolean;
    tooltipContent: string;
};

const SubmitButton: React.FC<OptionButtonProps> = ({
    onClick,
    tooltipContent,
    label,
    isDisabled = false,
    isLoading,
}) => {
    return (
        <PlainTooltip
            enabled={isDisabled}
            maxWidth={260}
            placement="top"
            tooltipContent={tooltipContent}
        >
            <div>
                <StyledSubmitButton isLoading={isLoading} isDisabled={isDisabled}>
                    <Button isDisabled={isDisabled} isLoading={isLoading} onClick={onClick}>
                        {label}
                    </Button>
                </StyledSubmitButton>
            </div>
        </PlainTooltip>
    );
};

export default SubmitButton;
