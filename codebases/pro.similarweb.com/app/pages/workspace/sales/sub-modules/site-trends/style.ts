import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledDropdownContainer = styled.div`
    display: flex;
    align-items: center;

    & .DropdownButton {
        width: fit-content;

        .DropdownButton-text {
            width: 100%;
            margin-right: 10px;
        }

        .DropdownButton--triangle {
            color: ${colorsPalettes.carbon["500"]} !important;
            position: static;
        }
    }
`;
