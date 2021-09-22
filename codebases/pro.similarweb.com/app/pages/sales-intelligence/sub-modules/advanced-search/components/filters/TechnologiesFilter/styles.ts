import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const ADD_BUTTON_TOOLTIP_MAX_WIDTH = 260;

export const StyledAddButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 16px;
`;

export const StyledEmptyText = styled.p<{ isHidden: boolean }>`
    ${mixins.setFont({ $color: colorsPalettes.carbon["400"], $size: 12 })};
    display: ${({ isHidden }) => (isHidden ? "none" : "block")};
    line-height: normal;
    margin: 0;
`;
