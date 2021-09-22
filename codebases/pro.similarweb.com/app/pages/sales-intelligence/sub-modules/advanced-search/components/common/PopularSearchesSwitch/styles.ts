import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { TextSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { SwitcherStyled } from "@similarweb/ui-components/dist/switcher/src/SwitcherComponents";
import { BaseSwitcherItemWrapper } from "@similarweb/ui-components/dist/switcher/src/items/BaseSwitcherItem";

export const StyledSwitchContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 24px;

    ${SwitcherStyled} {
        border: 1px solid ${colorsPalettes.navigation["NAV_BACKGROUND"]};
        border-radius: 4px;
        display: flex;
    }

    ${BaseSwitcherItemWrapper} {
        overflow: hidden;

        &:not(:last-child) {
            border-right: 1px solid ${colorsPalettes.navigation["NAV_BACKGROUND"]};
        }
    }

    ${TextSwitcherItem} {
        ${mixins.setFont({ $color: colorsPalettes.carbon["400"], $size: 14 })};
        box-sizing: border-box;
        padding: 0 24px;
        transition: none;
        width: auto;

        &.selected {
            ${mixins.setFont({ $color: colorsPalettes.blue["400"], $size: 14, $weight: 500 })};
            background-color: ${colorsPalettes.bluegrey["100"]};

            &:hover {
                background-color: ${colorsPalettes.bluegrey["100"]};
            }
        }

        &:hover {
            background-color: ${colorsPalettes.carbon["25"]};
        }
    }
`;
