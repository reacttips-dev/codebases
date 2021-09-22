import { colorsPalettes } from "@similarweb/styles";
import React, { FC } from "react";
import styled, { css } from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import * as numeral from "numeral";
import { NoChange } from "../StyledComponents";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import dayjs from "dayjs";
import _ from "lodash";

export const Tabs = styled.div`
    display: flex;
    height: 111px;
    align-items: center;
    overflow: hidden;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    @media (max-width: 420px) {
        order: 2;
        overflow-x: visible;
        border-top: 1px solid rgba(0, 0, 0, 0.12);
    }
`;
Tabs.displayName = "Tabs";

const CustomIcon: FC<any> = ({ className, iconName }) => {
    return <SWReactIcons className={className} iconName={iconName} />;
};

const StyledCustomIcon = styled(CustomIcon)`
    vertical-align: -1px;
    svg {
        width: 24px;
        height: 24px;
    }
    line-height: 1rem;
    margin-right: 8px;
    @media (max-width: 1200px) {
        svg {
            width: 16px;
            height: 16px;
        }
    }
`;

export const StyledTab: any = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 20%;
    height: 100%;
    padding: 0 12px;
    border-right: ${(props: any) => (props.last ? "none" : "1px solid rgba(0, 0, 0, 0.12)")};
    cursor: pointer;
    @media (max-width: 420px) {
        width: 100%;
    }
    ${(props: any) =>
        props.active &&
        css`
            background-color: #f6fafe;
            :after {
                content: "";
                position: absolute;
                height: 3px;
                width: 100%;
                left: 0px;
                bottom: 0px;
                background-color: #4e8cf9;
                @media (max-width: 420px) {
                    order: 2;
                    width: 3px;
                    height: 100%;
                }
            }
        `}
`;
StyledTab.displayName = "StyledTab";

export const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
FlexRow.displayName = "FlexRow";

export const FlexRowBase = styled(FlexRow)`
    align-items: baseline;
`;
FlexRowBase.displayName = "FlexRowBase";

export const TabText = styled.div`
    font-size: 16px;
    margin-right: 4px;
    color: ${colorsPalettes.carbon["500"]};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    @media (max-width: 1200px) {
        font-size: 15px;
    }
`;
TabText.displayName = "TabText";

export const TabValue = styled(TabText)`
    font-size: 20px;
    padding-left: 24px;
    padding-top: 10px;
    @media (max-width: 1200px) {
        font-size: 18px;
    }
`;
TabValue.displayName = "TabValue";

const StyledNoChange = styled(NoChange)`
    margin-left: 20px;
`;

const commonStyle = css`
    font-size: 20px;
    font-weight: 300;
    font-family: Roboto;
    line-height: 1em;
`;
const ChangeValueWrapper = styled.div`
    ${commonStyle}
    .ChangeValue {
        margin-left: 10px;
        ${commonStyle}
        .ChangeValue-arrow {
            width: 12.5px;
            height: 16.5px;
            display: inline-block;
            vertical-align: initial;
            transform: translateY(0px);
        }
        .ChangeValue-text {
            margin-left: 5px;
            display: initial;
            vertical-align: initial;
        }
    }
`;
ChangeValueWrapper.displayName = "ChangeValueWrapper";

export const Tab = (props) => {
    const {
        active,
        last,
        title,
        icon,
        value,
        onClick,
        changeValue,
        showTabChange,
        infoIcon,
        graphData,
        invertColors,
    } = props;
    const growthTooltip = `${dayjs(_.get(graphData, "[0].data[0][0]")).format(
        "MMM YYYY",
    )} vs. ${dayjs(_.get(graphData, `[0].data[${graphData[0].data.length - 1}][0]`)).format(
        "MMM YYYY",
    )}`;
    return (
        <StyledTab
            active={active}
            last={last}
            onClick={onClick}
            data-automation-tab
            data-automation-tab-active={active}
        >
            <FlexRow>
                <StyledCustomIcon iconName={icon} />
                <TabText title={title}>{title}</TabText>
                {infoIcon && (
                    <PlainTooltip tooltipContent={infoIcon}>
                        <div>
                            <SWReactIcons iconName="info" size="xs" />
                        </div>
                    </PlainTooltip>
                )}
            </FlexRow>
            <FlexRowBase>
                <TabValue>{value}</TabValue>
                {showTabChange && (
                    <PlainTooltip tooltipContent={growthTooltip}>
                        <ChangeValueWrapper>
                            {changeValue && changeValue !== "NA" ? (
                                <ChangeValue
                                    invertColors={invertColors}
                                    descriptionText={""}
                                    value={numeral(Math.abs(changeValue))
                                        .format("0[.]00a%")
                                        .toUpperCase()}
                                    isDecrease={changeValue < 0}
                                />
                            ) : (
                                <StyledNoChange>-</StyledNoChange>
                            )}
                        </ChangeValueWrapper>
                    </PlainTooltip>
                )}
            </FlexRowBase>
        </StyledTab>
    );
};
