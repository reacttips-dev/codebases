import React from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { AlignCenterContainer, TooltipCellHeaderContentWrapper } from "../styles";
import { DomainNameAndIcon } from "pages/workspace/common/tableAdditionalColumns";
import { StyledItemIcon } from "components/core cells/src/CoreRecentCell/StyledComponents";

/**
 * @date 2021-04-30
 *  This component creates item with domain and favicon wrapped in tooltip
 * @param {string} {domain}
 * @param {string} {icon}
 * @returns {JSX.Element}
 */

export const DomainFaviconHeader = ({
    domain,
    icon,
}: {
    domain: string;
    icon: string;
}): JSX.Element => (
    <PlainTooltip
        placement="top"
        tooltipContent={
            <TooltipCellHeaderContentWrapper>
                <DomainNameAndIcon domain={domain} icon={icon} />
            </TooltipCellHeaderContentWrapper>
        }
    >
        <AlignCenterContainer>
            <StyledItemIcon iconName="" iconSrc={icon} />
        </AlignCenterContainer>
    </PlainTooltip>
);
