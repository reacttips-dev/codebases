import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

export const StyledEmptyDescription = styled.p`
    ${mixins.setFont({ $color: rgba(colorsPalettes.midnight["500"], 0.54), $size: 14 })};
    line-height: 20px;
    margin: 0 0 12px;
    max-width: 275px;
`;

export const StyledEmptyTitle = styled.h3`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 16, $weight: 500 })};
    line-height: 19px;
    margin: 0 0 8px;
`;

export const StyledEmptyImageContainer = styled.div`
    margin-right: 27px;
`;

export const StyledListsEmptySection = styled.div`
    align-items: center;
    display: flex;
`;
