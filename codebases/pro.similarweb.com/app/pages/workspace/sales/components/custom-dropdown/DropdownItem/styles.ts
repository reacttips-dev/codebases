import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";

export const StyledDropdownItem = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    cursor: pointer;
    display: flex;
    height: 48px;
    justify-content: space-between;
    line-height: 48px;
    padding: 0 15px 0 47px;
    transition: background-color 400ms ease-out;

    &.item-locked {
        cursor: default;
    }

    &:hover {
        background-color: ${colorsPalettes.bluegrey["200"]};
    }

    & > span {
        color: ${colorsPalettes.carbon["500"]};
        font-size: 14px;
    }

    & > ${SWReactIcons} {
        svg {
            display: block;
        }
    }
`;
