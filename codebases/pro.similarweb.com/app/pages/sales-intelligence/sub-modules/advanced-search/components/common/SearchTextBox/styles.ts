import styled, { css } from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

export const StyledClearIconContainer = styled.div`
    cursor: pointer;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);

    &::after {
        content: "";
        height: 200%;
        left: -50%;
        position: absolute;
        top: -50%;
        width: 200%;
    }
`;

export const StyledInput = styled.input``;

export const StyledSearchInputContainer = styled.div<{ isDisabled: boolean; isFocused: boolean }>`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    ${({ isFocused }) =>
        isFocused &&
        css`
            box-shadow: 0 3px 6px ${rgba(colorsPalettes.carbon["500"], 0.08)};
        `};
    border: 1px solid
        ${({ isFocused }) => (isFocused ? colorsPalettes.blue["400"] : colorsPalettes.carbon["50"])};
    border-radius: 6px;
    display: flex;
    overflow: hidden;
    padding: 0 8px;
    position: relative;

    ${StyledInput} {
        ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon["400"], $weight: 400 })};
        background-color: ${colorsPalettes.carbon["0"]};
        border: none;
        box-shadow: none;
        cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "unset")};
        display: block;
        height: 40px;
        line-height: 16px;
        margin: 0;
        padding: 0 0 0 8px;
        width: 100%;

        &::placeholder {
            color: ${colorsPalettes.carbon["200"]};
        }
    }
`;

export const StyledSearchBox = styled.div`
    padding: 16px 0;
`;
