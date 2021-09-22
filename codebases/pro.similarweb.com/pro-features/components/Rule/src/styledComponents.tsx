import { colorsPalettes, rgba } from "@similarweb/styles";
import { SimpleChipItem } from "@similarweb/ui-components/dist/chip";
import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { IconButton } from "@similarweb/ui-components/dist/button";

export const RulesQueryBuilderContainer = styled.div`
    padding: 0;
    flex: auto;
    overflow: auto;

    @media screen and (max-width: 1280px) {
        margin-bottom: 24px;
    }

    @media screen and (min-width: 1281px) {
        margin-top: 8px;
        margin-bottom: 8px;
        padding-left: 24px;
        padding-right: 24px;
        padding-bottom: 64px;
    }
`;

export const StyledSummary = styled(FlexRow)`
    font-size: 14px;
    margin-left: 10px;
    flex: 1;
`;

export const RuleContainerBase = styled.div`
    border-width: 1px;
    border-color: ${colorsPalettes.carbon["100"]};
    border-radius: 4px;
    padding: 16px;
    background-color: ${colorsPalettes.carbon["0"]};
`;

export const InitRuleContainer = styled(RuleContainerBase)`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-style: dashed;
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.midnight[600], 0.08)};
`;

export interface ICompleteRuleContainerProps {
    include: boolean;
}

export const CompleteRuleContainer = styled(RuleContainerBase)<ICompleteRuleContainerProps>`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    border-style: none;
    border-left: 4px
        ${(props) => (props.include ? colorsPalettes.green.s100 : colorsPalettes.red.s100)} solid;
`;

export const CompleteRuleTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    font-size: 16px;
    color: ${colorsPalettes.carbon[500]};
`;

export const RuleBody = styled.div`
    flex: auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

export const RuleIndex = styled.span`
    flex: none;
    flex-basis: 32px;
    font-size: 14px;
    color: ${colorsPalettes.carbon["300"]};
`;

export const InitRuleContentText = styled.span`
    font-size: 16px;
    color: ${colorsPalettes.carbon["400"]};
    margin-bottom: 16px;
    text-align: center;
    max-width: 95%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

export const ChipWrapper = styled.div`
    margin-left: 8px;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    list-style-type: none;
`;

export const CompleteRuleChipItem = styled(SimpleChipItem)`
    background-color: ${colorsPalettes.carbon["400"]};
    color: ${colorsPalettes.carbon["0"]};
    & svg {
        color: ${colorsPalettes.carbon["0"]};
    }

    .ChipItemText {
        max-width: 200px;
    }
`;

export const ButtonWrapperForTooltip = styled.div`
    height: 32px;
    display: inline-block;
`;

export const StyledIconButton = styled(IconButton)`
    .SWReactIcons svg path {
        fill-opacity: 1;
    }
`;

export const TooltipButtonWrapper = styled.span`
    margin-left: 16px;
`;

export const QueryRuleDisplayContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 8px 0;
    word-break: break-word;
`;

export const QueryListTypeContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: flex-start;
    margin: 4px 0;
`;

export const QueryListTypeTitle = styled.div`
    flex: none;
    font-weight: bold;
    margin-right: 1em;
`;

export const QueryListTypeStrings = styled.div`
    flex: auto;
    position: relative;
`;

export const QueryListTypeStringsText = styled.div<{ expanded: boolean; fullHeight: number }>`
    transition: max-height 0.3s;
    overflow: hidden;
    max-height: ${({ expanded, fullHeight }) => (expanded ? `${fullHeight}px` : "5em")};

    .hiddenPlaceholder {
        display: none;
        visibility: hidden;
        padding: 0 8px;
    }
`;

export const ViewMoreLink = styled.a`
    cursor: pointer;
    background: ${colorsPalettes.carbon[0]};
    padding: 0 8px;
    position: absolute;
    bottom: 0;
    right: 0;
`;

export const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;
