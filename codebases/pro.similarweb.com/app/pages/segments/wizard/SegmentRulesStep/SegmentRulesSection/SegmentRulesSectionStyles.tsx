import styled from "styled-components";
import { subtitleFadeIn } from "components/Workspace/Wizard/src/steps/StyledComponents";
import { colorsPalettes } from "@similarweb/styles";
import { OverviewSectionTitle } from "pages/workspace/common components/OverviewPage/StyledComponents";

export const SegmentRulesSectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: auto;
    animation: ${subtitleFadeIn} ease-in-out 1000ms;
    padding: 0px;
    margin-bottom: 0px;
    box-sizing: border-box;
    margin-right: 16px;
    overflow: hidden;
`;

export const RuleBuilderInternalTitle = styled.div`
    color: ${colorsPalettes.carbon["200"]};
    font-size: 12px;
    text-transform: uppercase;
    font-family: roboto;
    font-weight: bold;
    height: 100%;
`;

export const TitleContainer = styled.div`
    flex: none;
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    & ${RuleBuilderInternalTitle} {
        align-self: center;
        justify-content: center;
    }
    padding-left: 24px;
`;

export const InternalTitleWrapper = styled(OverviewSectionTitle)`
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 16px;
    color: ${colorsPalettes.carbon["500"]};

    & a {
        color: ${colorsPalettes.blue["400"]};
    }
`;

export const SegmentRulesScrollAreaContainer = styled.div`
    flex: auto;
    overflow: hidden;
    z-index: 0;

    .ScrollArea {
        height: 100%;
    }
`;

export const LoaderContainer = styled.div`
    @media screen and (max-width: 1280px) {
        margin-bottom: 50px;
    }
`;
