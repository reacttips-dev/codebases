import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { colorsPalettes } from "@similarweb/styles";
import { ITableCellProps } from "../interfaces/ITableCellProps";

const StyledIconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledCheckIcon = styled(SWReactIcons)`
    & path {
        fill: ${colorsPalettes.navigation.ACTIVE_BLUE};
    }
    &.disabled {
        path {
            fill: ${colorsPalettes.carbon[100]};
        }
    }
`;

const StyledTooltipMessage = styled.div`
    font-weight: 400;
    color: ${colorsPalettes.carbon[300]};
    line-height: 16px;
`;

// Custom cell to show email sent state
export const BlueCheckCell: React.FC<
    ITableCellProps & {
        value: boolean;
    }
> = ({ value, row }) => {
    const translate = useTranslation();

    const tooltipMessage = `${translate("si.staticList.cell.blueCheck.email.tooltip")}: 
    ${dayjs(row?.lastSentEmailDate).format("MM/DD/YY")}`;

    if (value) {
        return (
            <PlainTooltip
                variation="white"
                placement="top"
                tooltipContent={<StyledTooltipMessage>{tooltipMessage}</StyledTooltipMessage>}
            >
                <StyledIconWrapper>
                    <StyledCheckIcon iconName="checked" size="xs" />
                </StyledIconWrapper>
            </PlainTooltip>
        );
    }

    const snapshotMonth = dayjs(row?.lastSentEmailDate).month();
    const currentMonth = dayjs(Date.now()).month();
    const isSendInPrevMonth = snapshotMonth + 1 === currentMonth;

    if (!value && isSendInPrevMonth) {
        return (
            <PlainTooltip variation="white" placement="top" tooltipContent={tooltipMessage}>
                <StyledIconWrapper className="disabled">
                    <StyledCheckIcon className="disabled" iconName="checked" size="xs" />
                </StyledIconWrapper>
            </PlainTooltip>
        );
    }

    return <></>;
};
