import React from "react";
import styled from "styled-components";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";

const StyledEmailHeaderCell = styled.div`
    display: flex;
    justify-content: center;
    cursor: pointer;
    & .SWReactIcons {
        height: 18px;
        width: 23px;
    }
`;

export const EmailCellHeader = () => {
    const translate = useTranslation();
    return (
        <PlainTooltip
            placement="top"
            maxWidth={190}
            tooltipContent={translate("si.insightsGenerator.table.headerCells.email.tooltip")}
        >
            <StyledEmailHeaderCell>
                <SWReactIcons iconName="mail" size="sm" />
            </StyledEmailHeaderCell>
        </PlainTooltip>
    );
};

EmailCellHeader.displayName = "EmailCellHeader";
