import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import DropdownContent from "./DropdownContent";

export const StyledDropdownContent = styled(DropdownContent)`
    background-color: ${colorsPalettes.carbon["0"]};
    border: 1px solid ${colorsPalettes.carbon["50"]};
    border-radius: 4px;
    box-shadow: 0 1px 5px ${rgba(colorsPalettes.carbon["500"], 0.12)};
    left: 0;
    position: absolute;
    top: 0;
    z-index: 11;

    &.--closed {
        display: none;
    }

    .ScrollArea .ScrollBar-container {
        opacity: 1;
    }
`;
