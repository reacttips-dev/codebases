import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledEntryName = styled.span`
    ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12, $weight: 700 })};
`;

export const StyledEntrySeparator = styled.span`
    text-transform: uppercase;
`;

export const StyledConditionItemControls = styled.div`
    display: flex;

    & > *:not(:last-child) {
        margin-right: 4px;
    }

    & .SWReactIcons svg path {
        fill: ${colorsPalettes.carbon["200"]};
        fill-opacity: 1;
    }

    & > *:hover .SWReactIcons svg path {
        fill: ${colorsPalettes.carbon["200"]};
    }
`;

export const StyledConditionItemValue = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12 })};
    align-items: center;
    display: flex;
    flex-flow: wrap row;
`;

export const StyledConditionItemSeparator = styled.div`
    margin: 8px 0;
    text-transform: uppercase;
`;

export const StyledConditionItem = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.bluegrey["100"]};
    border-radius: 6px;
    box-sizing: border-box;
    cursor: default;
    display: flex;
    justify-content: space-between;
    padding: 2px 8px 2px 12px;
    user-select: none;

    ${StyledConditionItemControls} > * {
        visibility: hidden;
    }

    &:hover {
        background-color: ${colorsPalettes.bluegrey["200"]};

        ${StyledConditionItemControls} > * {
            visibility: visible;
        }
    }
`;
