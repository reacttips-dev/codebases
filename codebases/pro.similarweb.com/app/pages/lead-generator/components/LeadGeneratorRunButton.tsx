import * as React from "react";
import { FC } from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import LeadGeneratorTooltip from "./LeadGeneratorTooltip";

interface ILeadGeneratorRunButtonProps {
    isDisabled: boolean;
    onClick: () => void;
    tooltipText: string;
    buttonText: string;
}

const LeadGeneratorRunButton: FC<ILeadGeneratorRunButtonProps> = ({
    isDisabled,
    onClick,
    tooltipText,
    buttonText,
}) => {
    if (isDisabled) {
        return (
            <LeadGeneratorTooltip text={tooltipText}>
                <Button isDisabled width={98}>
                    {buttonText}
                </Button>
            </LeadGeneratorTooltip>
        );
    }
    return (
        <Button onClick={onClick} width={98}>
            {buttonText}
        </Button>
    );
};

export default LeadGeneratorRunButton;
