import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledDescription = styled.p`
    ${mixins.setFont({ color: colorsPalettes.carbon["300"], $size: 13 })};
    line-height: 20px;
    margin-top: 3px;
    max-width: 330px;
    text-align: center;
`;

export const StyledTitle = styled.h2`
    ${mixins.setFont({ color: colorsPalettes.carbon["400"], $size: 16 })};
    line-height: 1.1;
    margin: 16px 0 0;
    text-align: center;
`;

export const StyledImageContainer = styled.div`
    svg {
        height: 96px;
    }
`;

export const StyledEmptyStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 24px 32px;
`;
