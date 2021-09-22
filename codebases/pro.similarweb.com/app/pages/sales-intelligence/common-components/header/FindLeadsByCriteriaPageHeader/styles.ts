import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledFindLeadsByCriteriaPageHeader = styled.div<{ step: number }>`
    background-color: ${({ step }) =>
        step === 0 ? colorsPalettes.bluegrey["200"] : "transparent"};
`;
