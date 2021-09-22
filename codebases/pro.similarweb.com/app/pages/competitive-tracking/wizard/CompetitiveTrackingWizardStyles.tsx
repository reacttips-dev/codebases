import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const WizardContainer = styled.div`
    display: grid;
    grid-template-columns: 10% 80%;
`;

export const LegendContainer = styled.div`
    margin-bottom: 130px;
    width: 100%;
    padding-top: 14px;
`;

export const StepContainer = styled.div`
    max-height: 592px;
    width: 700px;
    background: ${colorsPalettes.carbon[0]};
    box-shadow: 0px 3px 6px rgba(14, 30, 62, 0.08);
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
`;

export const CancelButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    padding: 32px 32px 10px 0;
    box-sizing: border-box;
`;

export const BackButtonContainer = styled.div`
    padding: 25px 0px 0px 14px;
`;

export const StepsWrapper = styled.div`
    display: flex;
    justify-content: center;
`;
