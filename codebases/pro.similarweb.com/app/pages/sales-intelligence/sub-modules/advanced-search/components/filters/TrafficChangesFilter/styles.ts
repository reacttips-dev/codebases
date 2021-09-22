import styled, { css } from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

const EDIT_WIDTH = 32;
const SWITCH_WIDTH = 38;

export const StyledAddFilterContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 16px;
`;

export const StyledTrafficChangeSwitch = styled.div`
    flex-shrink: 0;
    margin-left: 4px;

    & > div {
        margin-right: 0;
    }
`;

export const StyledTrafficChangeEdit = styled.div`
    flex-shrink: 0;

    & .SWReactIcons svg path {
        fill-opacity: 1;
    }

    & button:hover .SWReactIcons svg path {
        fill: ${colorsPalettes.carbon["200"]};
    }
`;

export const StyledTrafficChangeControls = styled.div`
    align-items: center;
    display: flex;
    margin-left: 4px;
`;

export const StyledTrendValueText = styled.span<{ enabled: boolean }>`
    ${({ enabled }) =>
        enabled &&
        css`
            & > span {
                font-weight: 700;
            }
        `};
`;

export const StyledTrafficChangeItemText = styled.p`
    ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12 })};
    flex-grow: 0;
    flex-shrink: 0;
    line-height: 34px;
    margin: 0;
    max-width: calc(100% - (${EDIT_WIDTH}px + ${SWITCH_WIDTH}px + 8px));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StyledTrafficChangeItem = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;

    &:not(:first-child) {
        margin-top: 20px;
    }
`;

export const StyledTrafficChangeItems = styled.div``;
