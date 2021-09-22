import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

export const StyledInfoSection = styled.div`
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon["500"], 0.6) })};
`;
