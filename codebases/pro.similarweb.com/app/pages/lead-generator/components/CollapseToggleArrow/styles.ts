import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import CollapseToggleArrow from "./CollapseToggleArrow";

export const FiltersBoxCollapseToggle = styled(CollapseToggleArrow)`
    ${SWReactIcons} {
        background-color: transparent;
        border-radius: 50%;
        cursor: ${(props) => (props.disabled ? "default" : "pointer")};
        flex-shrink: 0;
        transition: all 200ms;
        transform: rotate(${(props) => (props.collapsed ? 0 : 180)}deg);

        &:hover {
            background-color: rgba(236, 238, 239, 0.68);
        }

        path {
            fill: ${(props) => (props.disabled ? colorsPalettes.carbon[200] : "#4c88f0")};
        }
    }
`;
