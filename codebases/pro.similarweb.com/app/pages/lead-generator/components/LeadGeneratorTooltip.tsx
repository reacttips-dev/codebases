import * as React from "react";
import { StatelessComponent } from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { LeadGeneratorTooltipWrapper } from "./elements";

interface ILeadGeneratorTooltipProps {
    text: string;
    placement?: string;
    cssClass?: string;
}

const LeadGeneratorTooltip: StatelessComponent<ILeadGeneratorTooltipProps> = ({
    text,
    placement = "bottom",
    cssClass,
    children,
}) => (
    <LeadGeneratorTooltipWrapper>
        <PlainTooltip placement={placement} tooltipContent={text} cssClass={cssClass}>
            <div>{children}</div>
        </PlainTooltip>
    </LeadGeneratorTooltipWrapper>
);

export default LeadGeneratorTooltip;
