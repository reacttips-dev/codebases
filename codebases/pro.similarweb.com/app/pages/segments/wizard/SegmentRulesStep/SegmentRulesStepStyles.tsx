import styled from "styled-components";
import { ButtonContainer } from "../../../../../.pro-features/components/Workspace/Wizard/src/steps/StyledComponents";
import { colorsPalettes } from "@similarweb/styles";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";

/**
 * Top level container of the segment rules component
 */
export const SegmentRulesStepContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex: auto;
    overflow: hidden;
    width: 100%;
    max-width: 1366px;
    padding: 0 40px;

    @media screen and (max-width: 1280px) {
        overflow: auto;
    }
`;

/**
 * Main content container. used to separate the rule component
 * from the "save segment" button
 */
export const SegmentRulesStepTopContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex: auto;
    overflow: hidden;

    @media screen and (max-width: 1280px) {
        flex-direction: column;
        align-items: normal;
        height: auto;
        overflow: visible;
    }
`;

export const SegmentRulesStepColumnContainer = styled(FlexColumn)`
    padding: 40px 0;
`;

/**
 * Container for the rule builder (left part of the screen)
 */
export const RuleBuilderStepContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex: auto;
    align-items: center;
    max-width: 100%;
`;

export const ButtonContainerWithMargin = styled(ButtonContainer)`
    padding-top: 23px;
    margin-top: 0px;
    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: ${colorsPalettes.midnight["50"]};
    width: 100%;
`;
