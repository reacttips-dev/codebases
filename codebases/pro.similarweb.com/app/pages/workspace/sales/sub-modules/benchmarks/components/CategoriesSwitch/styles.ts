import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { TextSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { SwitcherStyled } from "@similarweb/ui-components/dist/switcher/src/SwitcherComponents";
import { BaseSwitcherItemWrapper } from "@similarweb/ui-components/dist/switcher/src/items/BaseSwitcherItem";

export const StyledCategoriesSwitch = styled.div`
    display: flex;
    justify-content: center;

    ${SwitcherStyled} {
        border: 1px solid ${colorsPalettes.carbon["100"]};
        border-radius: 4px;
        display: flex;
    }

    ${BaseSwitcherItemWrapper} {
        position: relative;

        &:not(:last-child) {
            border-right: 1px solid ${colorsPalettes.carbon["100"]};
        }

        &:first-child {
            ${TextSwitcherItem} {
                border-bottom-left-radius: 4px;
                border-top-left-radius: 4px;

                &::after {
                    border-bottom-left-radius: 4px;
                    border-top-left-radius: 4px;
                }
            }
        }

        &:last-child {
            ${TextSwitcherItem} {
                border-bottom-right-radius: 4px;
                border-top-right-radius: 4px;

                &::after {
                    border-bottom-right-radius: 4px;
                    border-top-right-radius: 4px;
                }
            }
        }
    }

    ${TextSwitcherItem} {
        ${mixins.setFont({ $color: colorsPalettes.carbon["400"], $size: 14 })};
        transition: none;
        width: 127px;

        &::after {
            background-color: transparent;
            border: 1px solid transparent;
            content: "";
            height: 100%;
            position: absolute;
            pointer-events: none;
            width: 100%;
        }

        &.selected {
            ${mixins.setFont({ $color: colorsPalettes.blue["400"], $size: 14, $weight: 500 })};
            background-color: ${colorsPalettes.carbon["0"]};

            &:hover {
                background-color: ${colorsPalettes.carbon["0"]};
            }

            &::after {
                border-color: ${colorsPalettes.blue["400"]};
            }
        }

        &:hover {
            background-color: ${colorsPalettes.carbon["25"]};
        }
    }
`;
