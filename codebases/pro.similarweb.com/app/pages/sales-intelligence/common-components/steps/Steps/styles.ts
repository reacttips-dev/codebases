import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledStepsSeparator = styled.div`
    box-shadow: 0 1px 0 0 ${colorsPalettes.midnight["100"]};
    height: 1px;
    margin-top: -22px;
    width: 186px;
`;

export const StyledStepItem = styled.div`
    align-items: center;
    display: flex;
    height: 48px;
`;

export const StyledStepsContainer = styled.div`
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
`;
