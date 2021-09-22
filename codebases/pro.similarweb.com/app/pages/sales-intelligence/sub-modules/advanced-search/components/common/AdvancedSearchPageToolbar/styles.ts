import styled from "styled-components";
import { colorsPalettes, fonts, mixins } from "@similarweb/styles";

export const StyledTitle = styled.h1`
    ${mixins.setFont({
        $size: 24,
        $weight: 500,
        $family: fonts.$dmSansFontFamily,
        $color: colorsPalettes.carbon["500"],
    })};
    margin: 0;
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: capitalize;
    white-space: nowrap;
`;

export const StyledToolbar = styled.div`
    align-items: center;
    display: flex;
    flex-grow: 1;
    padding: 0 24px;

    & > div {
        margin-left: 8px;

        &:first-of-type {
            margin-left: 16px;
        }
    }
`;
