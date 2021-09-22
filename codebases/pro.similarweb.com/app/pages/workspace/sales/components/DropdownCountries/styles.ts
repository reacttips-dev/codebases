import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";

export const StyledDropdownContainer = styled.div`
    display: flex;
    align-items: center;

    .DropdownButton {
        border: 0;
        font-size: 16px;
        background-color: ${colorsPalettes.carbon["0"]};
        width: auto !important;

        &-text {
            text-indent: 10px;
            color: ${colorsPalettes.carbon["500"]};
        }

        &--triangle {
            position: relative;
            right: 0;
            top: unset;
        }

        &--filtersBarDropdownButton {
            .DropdownButton-text {
                color: ${colorsPalettes.carbon["500"]};
                width: auto;
                margin-right: 10px;
            }

            .DropdownButton--triangle {
                color: ${colorsPalettes.carbon["500"]} !important;
            }

            &:hover {
                background-color: ${colorsPalettes.carbon["0"]};
                color: ${colorsPalettes.carbon["500"]};
                border: 0;
            }
        }

        &:active {
            color: ${rgba(colorsPalettes.carbon[500], 0.5)};
            .DropdownButton--triangle {
                color: ${colorsPalettes.carbon["500"]};
            }
        }

        &:hover {
            box-shadow: none;
            .DropdownButton--triangle {
                color: ${colorsPalettes.carbon["300"]};
            }
        }
    }
`;

export const StyledPrefix = styled.div`
    font-size: 16px;
    line-height: 24px;
`;
