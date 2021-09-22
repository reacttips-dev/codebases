import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import {
    SliderDescription,
    SliderHeader,
    SliderTitle,
    SliderWrapper,
} from "@similarweb/ui-components/dist/slider";
import * as React from "react";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled, { css } from "styled-components";

import { LeadGeneratorBox } from "../../components/elements";

export const LeadGeneratorNewWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;
LeadGeneratorNewWrapper.displayName = "LeadGeneratorNewWrapper";

export const ReportQueryWrapper = styled.div`
    display: flex;
    justify-content: center;
`;
ReportQueryWrapper.displayName = "ReportQueryWrapper";

export const LeadGeneratorNewHeader = styled.div`
    width: 832px;
`;
LeadGeneratorNewHeader.displayName = "LeadGeneratorNewHeader";

export const LeadGeneratorNewLeft = styled.div`
    width: 580px;
`;
LeadGeneratorNewLeft.displayName = "LeadGeneratorNewLeft";

export const LeadGeneratorNewRight = styled.div`
    width: 248px;
`;
LeadGeneratorNewRight.displayName = "LeadGeneratorNewRight";

export const GeneralBoxSection = styled.div`
    padding: 30px 30px 20px;
`;
GeneralBoxSection.displayName = "GeneralBoxSection";

export const GeneralBoxFooter = styled.span`
    padding: 20px 30px;
    display: flex;
    align-items: center;
`;
GeneralBoxFooter.displayName = "GeneralBoxFooter";

export const GeneralBoxFooterIcon = styled.span.attrs(() => ({
    children: <SWReactIcons iconName="visits" />,
}))`
    margin: 5px 10px 0 0;
    svg {
        width: 15px;
        height: 15px;
    }
`;
GeneralBoxFooterIcon.displayName = "GeneralBoxFooterIcon";

export const GeneralBoxFooterText = styled.span`
    color: rgba(42, 62, 82, 0.8);
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
`;
GeneralBoxFooterText.displayName = "GeneralBoxFooterText";

export const ReportSummaryBox = styled.div`
    position: fixed;
    width: 248px;
    border-radius: 6px;
    background-color: ${colorsPalettes.carbon["0"]};
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    margin: 16px 0 0 16px;
    hr {
        margin: 0 0 20px;
    }
`;
ReportSummaryBox.displayName = "ReportSummaryBox";

interface IReportSummaryHeaderProps {
    growContext: boolean;
}

export const ReportSummaryHeader = styled.div.attrs<IReportSummaryHeaderProps>(() => ({
    "data-automation": "report-summary-header",
}))<IReportSummaryHeaderProps>`
    padding: 20px;
    border-radius: 4px 4px 0 0;
    background-color: ${({ growContext }) =>
        growContext ? colorsPalettes.mint["400"] : colorsPalettes.blue["400"]};
`;
ReportSummaryHeader.displayName = "ReportSummaryHeader";

export const ReportTitle = styled.div.attrs(() => ({
    "data-automation": "report-summary-title",
}))`
    text-transform: uppercase;
    color: ${colorsPalettes.carbon["0"]};
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    word-wrap: break-word;
`;
ReportTitle.displayName = "ReportTitle";

export const ReportSubtitle = styled.div.attrs(() => ({
    "data-automation": "report-summary-subtitle",
}))`
    height: auto;
    margin-top: 10px;
    color: ${colorsPalettes.carbon["0"]};
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
`;
ReportSubtitle.displayName = "ReportSubtitle";

export const ReportSummaryContent = styled.div`
    padding: 20px 20px 5px;
    overflow-x: hidden;
    max-height: 350px;
    @media (max-height: 850px) {
        height: 250px;
    }
    @media (max-height: 750px) {
        height: 150px;
    }
    @media (max-height: 700px) {
        height: 100px;
    }
    &::-webkit-scrollbar {
        background-color: transparent;
        width: 8px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: ${colorsPalettes.bluegrey["200"]};
    }
`;
ReportSummaryContent.displayName = "ReportSummaryContent";

export const ReportSummaryFooter = styled.div`
    display: flex;
    padding: 0px 10px 20px;
    justify-content: flex-end;
    > span {
        margin: 0;
    }
    button {
        margin-left: 8px;
    }
`;
ReportSummaryFooter.displayName = "ReportSummaryFooter";

export const SummaryFilterContainer = styled.div`
    margin: 10px 0;
`;
SummaryFilterContainer.displayName = "SummaryFilterContainer";

export const FilterTitle = styled.div`
    text-transform: uppercase;
    color: ${colorsPalettes.carbon["500"]};
    font-size: 10px;
    font-weight: 500;
    line-height: 16px;
`;
FilterTitle.displayName = "FilterTitle";

export const FilterDescription = styled.div`
    margin: 3px 0;
    color: rgba(42, 62, 82, 0.6);
    font-size: 16px;
    line-height: 20px;
`;

FilterDescription.displayName = "FilterDescription";

export const LeadGeneratorFilter = styled.div`
    &:not(:first-child) {
        margin: 30px 0;
    }
`;
LeadGeneratorFilter.displayName = "LeadGeneratorFilter";

interface ICountryFilterWrapperProps {
    chipsExist: boolean;
}

export const InputComboBoxWrapper = styled.div<ICountryFilterWrapperProps>`
    padding-top: 16px;
    height: ${({ chipsExist }) => (chipsExist ? "auto" : "32px")};
`;
InputComboBoxWrapper.displayName = "InputComboBoxWrapper";

export const ToggleSection = styled.div`
    display: flex;
    justify-content: space-between;
`;
ToggleSection.displayName = "ToggleSection";

export const SwitcherContainer = styled.div`
    display: flex;
    align-items: center;
`;
SwitcherContainer.displayName = "SwitcherContainer";

export const SwitcherTitle = styled.span`
    margin-right: 10px;
    font-size: 14px;
`;
SwitcherTitle.displayName = "SwitcherTitle";

export const DemographicBoxWrapper = styled.div`
    ${LeadGeneratorBox} {
        padding-bottom: 24px;
    }
`;

export const LeadGeneratorSectionTitle = styled.div`
    font-size: 16px;
    display: flex;
    align-items: center;
`;

export const LeadGeneratorPrefaceBox = styled(LeadGeneratorSectionTitle)`
    color: #657d8b;
    font-size: 14px;
    line-height: 1;
    margin-top: 32px;
    text-transform: uppercase;
`;

export const LeadGeneratorGenderTitle = styled.div`
    margin: 16px 0;
`;

export const LeadGeneratorGenderWrapper = styled.div`
    margin-bottom: 24px;
    ${LeadGeneratorFilter} {
        margin: 0 0 16px;
    }
    .TextSwitcher span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 30px;
    }
    ${SliderWrapper} {
        margin-top: 8px;
    }
    ${SliderHeader} {
        justify-content: flex-end;
    }
    ${SliderTitle} {
        display: none;
    }
    ${SliderDescription} {
        margin-top: -34px;
    }
    p {
        margin: 16px 0;
    }
`;

export const LeadGeneratorAgeTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 16px 22px 0 30px;
    border-top: 1px solid #e5e7ea;
`;

export const TldBoxWrapper = styled.div`
    p {
        margin: 16px 0 0;
    }
    ${InputComboBoxWrapper} {
        padding-top: 8px;
        margin-bottom: 8px;
    }
`;

export const WizardBoxContent = styled(LeadGeneratorBox)`
    padding: 12px 24px;
`;

export const WizardBoxTitle = styled.div`
    font-size: 24px;
    line-height: 32px;
    color: ${colorsPalettes.carbon["500"]};
    margin-top: 16px;
`;

export const WizardBoxSubtitle = styled.div`
    font-size: 14px;
    line-height: 18px;
    color: ${colorsPalettes.carbon["400"]};
    margin: 16px 0 24px;
`;

interface IGroupingBoxContentProps {
    visible: boolean;
}

export const GroupingBoxContent = styled(LeadGeneratorBox)<IGroupingBoxContentProps>`
    transition: all 0.2s ease-in-out;
    background-color: ${colorsPalettes.carbon["400"]};
    display: flex;
    height: auto;
    padding: 24px;
    margin: 16px 0;
    overflow: hidden;
    .SWReactIcons {
        padding-right: 8px;
        svg path {
            fill: ${colorsPalettes.carbon["0"]};
        }
    }
    ${(props) =>
        !props.visible &&
        css`
            height: 0;
            padding: 0;
            margin: 0;
            opacity: 0;
        `}
`;

export const GroupingBoxTitle = styled.div`
    color: ${colorsPalettes.carbon["0"]};
    font-size: 16px;
    margin: 2px 0 16px;
`;

export const GroupingBoxText = styled.div`
    color: ${colorsPalettes.carbon["0"]};
    font-size: 14px;
    margin-bottom: 8px;
`;

export const GroupingBoxButton = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const CountriesBoxWarningContent = styled.div<IGroupingBoxContentProps>`
    transition: all 0.2s ease-in-out;
    background-color: ${rgba(colorsPalettes.carbon[500], 0.06)};
    display: flex;
    padding: 16px;
    margin-top: 8px;
    border-radius: 6px;
    .SWReactIcons svg path {
        fill: ${colorsPalettes.carbon[500]};
    }
    ${(props) =>
        !props.visible &&
        css`
            height: 0;
            padding: 0;
            margin: 0;
            opacity: 0;
        `}
`;

export const CountriesBoxWarningText = styled.div`
    color: ${colorsPalettes.carbon[500]};
    font-size: 14px;
    padding-left: 8px;
    flex: 1;
`;

export const LeadGeneratorBoxHeader = styled.div`
    display: flex;
    align-items: center;
    .SWReactIcons {
        margin: 0 4px 2px;
    }
`;

export const FunctionalFlagFilterWrapper = styled.div`
    display: flex;

    & > div:last-of-type {
        margin-left: 18px;
    }

    &.isLocked {
        position: relative;
    }
`;

export const StyledLeadGeneratorFilterLock = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;
`;
