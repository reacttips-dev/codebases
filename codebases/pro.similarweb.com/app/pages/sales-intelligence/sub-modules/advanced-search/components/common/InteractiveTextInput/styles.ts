import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledInput = styled.input``;

export const StyledIconContainer = styled.div`
    left: 16px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
`;

export const StyledFieldContainer = styled.div`
    position: relative;

    ${StyledInput} {
        ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon["400"], $weight: 400 })};
        border: 1px solid ${colorsPalettes.midnight["50"]};
        border-radius: 3px;
        box-shadow: none;
        display: block;
        height: 40px;
        line-height: 16px;
        margin: 0;
        padding: 0 16px 0 48px;
        width: 100%;

        &:focus {
            border-color: ${colorsPalettes.midnight["50"]};
        }

        &::placeholder {
            color: ${colorsPalettes.carbon["200"]};
        }
    }
`;
