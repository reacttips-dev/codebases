import { colorsPalettes, rgba } from "@similarweb/styles";
import * as React from "react";
import styled, { css } from "styled-components";

import { SWReactIcons } from "@similarweb/icons";

export const LeadGeneratorWrapper = styled.div`
    display: flex;
    justify-content: center;
    @media (max-width: 1920px) {
        max-width: 1596px;
    }
    @media (max-width: 1600px) {
        max-width: 1276px;
    }
    @media (max-width: 1440px) {
        max-width: 1116px;
    }
    @media (max-width: 1400px) {
        max-width: 1076px;
    }
    @media (max-width: 1366px) {
        max-width: 1042px;
    }
    @media (max-width: 1280px) {
        max-width: 956px;
    }
    @media (max-width: 1024px) {
        max-width: 700px;
    }
    @media (max-width: 767px) {
        max-width: 443px;
    }
`;
LeadGeneratorWrapper.displayName = "LeadGeneratorWrapper";

export const LeadGeneratorTitle = styled.div`
    color: rgba(42, 62, 82);
    color: ${colorsPalettes.carbon["500"]};
    font-size: 24px;
    line-height: 32px;
    letter-spacing: 0.3px;
`;
LeadGeneratorTitle.displayName = "LeadGeneratorTitle";

interface ILeadGeneratorBoxProps {
    "data-automation": string;
}

export const LeadGeneratorBox = styled.div.attrs<ILeadGeneratorBoxProps>((props) => ({
    "data-automation": props["data-automation"],
}))<ILeadGeneratorBoxProps>`
    border-radius: 6px;
    background-color: #ffffff;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    padding: 24px 0;
    margin: 16px 0;

    hr {
        margin: 0;
    }

    .DropdownButton {
        background-color: #ffffff;
        color: #536275;
        border: 1px solid ${rgba(colorsPalettes.carbon[100], 0.6)};
    }

    .DropdownButton--disabled {
        background-color: ${colorsPalettes.carbon[25]};
        color: ${rgba(colorsPalettes.carbon[500], 0.4)};
        border: 1px solid ${colorsPalettes.carbon[50]};
    }

    &.isLocked {
        position: relative;
        border: 1px solid ${colorsPalettes.indigo["300"]};
    }
`;
LeadGeneratorBox.displayName = "LeadGeneratorBox";

export const LeadGeneratorBoxTitle = styled.div.attrs(() => ({
    "data-automation": "lead-generator-box-title",
}))`
    color: rgba(42, 62, 82);
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
`;
LeadGeneratorBoxTitle.displayName = "LeadGeneratorBoxTitle";

export const LeadGeneratorBoxSubtitle = styled.div`
    color: rgba(42, 62, 82, 0.6);
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 16px;
    display: flex;
`;
LeadGeneratorBoxSubtitle.displayName = "LeadGeneratorBoxSubtitle";

export const LeadGeneratorTooltipWrapper = styled.span`
    margin: 0 7px;
`;
LeadGeneratorTooltipWrapper.displayName = "LeadGeneratorTooltipWrapper";

export const LeadGeneratorInfoIcon = styled.span.attrs(() => ({
    children: <SWReactIcons iconName="info" />,
}))`
    svg {
        display: flex;
        width: 16px;
        height: 16px;
    }
`;
LeadGeneratorInfoIcon.displayName = "LeadGeneratorInfoIcon";

export const ReportsQuotaWrapper = styled.div`
    font-family: Roboto;
    display: flex;
    font-size: 14px;
`;
ReportsQuotaWrapper.displayName = "ReportsQuotaWrapper";

export const ReportsQuotaPercents = styled.div`
    color: rgba(42, 62, 82, 0.6);
    font-weight: 500;
`;
ReportsQuotaPercents.displayName = "ReportsQuotaPercents";

export const ReportsQuotaDetailed = styled.div`
    color: rgba(42, 62, 82, 0.8);
    font-weight: 500;
`;
ReportsQuotaDetailed.displayName = "ReportsQuotaDetailed";

export interface IReportsQuotaDivProps {
    state: number;
    percents: number;
}

export const ReportsQuotaDiv = styled.div<IReportsQuotaDivProps>`
    width: 88px;
    height: 16px;
    background: ${({ state, percents }) => {
        const color =
            state === 1 ? colorsPalettes.blue["400"] : state === 2 ? "#FF8100" : "#FF442D";
        return `linear-gradient(to right, ${color} 0%, ${color} ${percents}%, #dadce3 ${percents}%, #dadce3 100%)`;
    }};
    border-radius: 3px;
    margin: 2px 10px 0 2px;
`;
ReportsQuotaDiv.displayName = "ReportsQuotaDiv";

export interface ILeadGeneratorChipsWrapperProps {
    showBorder: boolean;
}

export const LeadGeneratorChipsWrapper = styled.div<ILeadGeneratorChipsWrapperProps>`
    border: ${({ showBorder }) => (showBorder ? "1px solid #ECEEF0" : "none")};
    padding: ${({ showBorder }) => (showBorder ? "10px" : 0)};

    hr {
        margin: 8px 0;
    }
`;
LeadGeneratorChipsWrapper.displayName = "LeadGeneratorChipsWrapper";

export const LeadGeneratorPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 70px auto;
`;
LeadGeneratorPageWrapper.displayName = "LeadGeneratorPageWrapper";

export const LeadGeneratorErrorIcon = styled.span.attrs(() => ({
    children: <SWReactIcons iconName="warning" />,
}))`
    svg {
        display: flex;
        width: 104px;
        height: 104px;
    }
`;
LeadGeneratorErrorIcon.displayName = "LeadGeneratorErrorIcon";

export const LeadGeneratorPageErrorTitle = styled.div`
    color: rgba(42, 62, 82, 0.6);
    font-size: 20px;
    line-height: 24px;
    margin: 16px 0;
`;
LeadGeneratorPageErrorTitle.displayName = "LeadGeneratorPageErrorTitle";

export const LeadGeneratorPageErrorSubtitle = styled.div`
    display: flex;
    color: rgba(42, 62, 82, 0.6);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.22px;
    line-height: 16px;
    a {
        margin: 0 4px;
    }
`;
LeadGeneratorPageErrorSubtitle.displayName = "LeadGeneratorPageErrorSubtitle";

export const LeadGeneratorPageSubtitleLink = styled.a`
    cursor: pointer;
    color: ${colorsPalettes.blue["400"]};
`;
LeadGeneratorPageSubtitleLink.displayName = "LeadGeneratorPageSubtitleLink";

export const LeadGeneratorReturnLinkWrapper = styled.a`
    width: fit-content;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: rgba(42, 62, 82, 0.6);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.17px;
    line-height: 18px;
    text-transform: uppercase;
    margin: 40px 0 48px;
    svg {
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }
`;
LeadGeneratorReturnLinkWrapper.displayName = "LeadGeneratorReturnLinkWrapper";

export const LeadGeneratorPageLoaderTitle = styled.div`
    color: rgba(42, 62, 82, 0.8);
    font-size: 20px;
    line-height: 24px;
    margin: 16px 0;
`;
LeadGeneratorPageLoaderTitle.displayName = "LeadGeneratorPageLoaderTitle";

export const LeadGeneratorPageLoaderSubtitle = styled.div`
    color: rgba(42, 62, 82, 0.6);
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
`;
LeadGeneratorPageLoaderSubtitle.displayName = "LeadGeneratorPageLoaderSubtitle";

export const StyledLeadGeneratorLockIcon = styled.span.attrs(() => ({
    children: <SWReactIcons iconName="locked" />,
}))`
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${colorsPalettes.indigo["300"]};
    transform: translate3d(50%, -50%, 0);

    svg {
        width: 14px;
        height: 14px;
        margin-top: 3px;

        path {
            fill: #fff;
            fill-opacity: 1;
        }
    }

    &.isInline {
        position: static;
        transform: translate3d(0, 0, 0);
        align-self: center;
    }
`;
StyledLeadGeneratorLockIcon.displayName = "StyledLeadGeneratorLockIcon";

export const StyledLeadGeneratorLockContainer = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.7);
    transition: background-color 0.2s ease-in-out;

    .Button {
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
    }

    &:hover {
        background-color: rgba(121, 117, 242, 0.1);

        .Button {
            opacity: 1;
        }
    }

    &.disabled {
        background-color: transparent;
    }

    &.disabled:hover {
        .Button {
            opacity: 0;
        }
    }
`;
StyledLeadGeneratorLockContainer.displayName = "StyledLeadGeneratorLockContainer";
