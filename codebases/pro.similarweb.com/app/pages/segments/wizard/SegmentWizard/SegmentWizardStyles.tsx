import { colorsPalettes } from "@similarweb/styles";
import styled from "styled-components";
import { Wrapper, StepWrapper, LegendContainer } from "components/Workspace/Wizard/src/Wizard";

export const WizardContainer = styled.div`
    height: 100%;

    ${Wrapper} {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    ${StepWrapper} {
        flex: auto;
        overflow: hidden;

        @media screen and (max-width: 1280px) {
            overflow: auto;
        }
    }

    ${LegendContainer} {
        flex: none;
    }
`;

export const SegmentsWarningBannerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-size: 16px;
    line-height: 20px;
    padding: 16px 32px;
    background: ${colorsPalettes.yellow[200]};
`;

export const SegmentsWarningBannerContent = styled.div`
    text-align: center;
`;

export const SegmentsWarningBannerContentPrimary = styled.span`
    font-weight: 500;
`;

export const SegmentsWarningBannerContentSecondary = styled.span`
    font-weight: 300;
    margin-left: 0.5em;
`;
