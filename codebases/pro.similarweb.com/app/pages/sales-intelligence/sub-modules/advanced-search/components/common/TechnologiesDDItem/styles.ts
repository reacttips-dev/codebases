import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledSecondaryName = styled.span`
    color: ${colorsPalettes.carbon["100"]};

    & .highlighted {
        color: ${colorsPalettes.carbon["500"]};
        font-weight: 500;
    }
`;

export const StyledItemName = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $weight: 500, $size: 14 })};
    line-height: 48px;
    max-width: 95%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    & .highlighted {
        display: inline-block;
        position: relative;

        &::after {
            background-color: ${colorsPalettes.blue["100"]};
            content: "";
            height: 24px;
            left: -1px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: calc(100% + 2px);
            z-index: -1;
        }
    }
`;

export const StyledItemCheckbox = styled.div`
    flex-shrink: 0;
`;

export const StyledItemContainer = styled.div<{ itemHeight?: number }>`
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    height: ${({ itemHeight }) => (itemHeight ? itemHeight : 48)}px;
    justify-content: space-between;
    padding: 12px 20px 12px 24px;
`;
