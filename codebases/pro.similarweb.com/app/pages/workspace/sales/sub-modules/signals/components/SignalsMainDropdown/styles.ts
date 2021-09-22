import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import SignalsMainDropdown from "./SignalsMainDropdown";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { NoBorderButtonWrap } from "@similarweb/ui-components/dist/dropdown/src/chipdown/ChipdownStyles";
import { TextWrapper } from "@similarweb/ui-components/dist/dropdown/src/buttons/NoBorderButton";
import { CollapsibleToggleStyled } from "@similarweb/ui-components/dist/collapsible/src/CollapsibleStyles";

export const StyledMainDropdown = styled(SignalsMainDropdown)`
    position: relative;

    ${NoBorderButtonWrap} {
        justify-content: space-between;
        width: 100%;

        ${TextWrapper} {
            white-space: nowrap;
        }
    }

    &-drop-down-content {
        ${CollapsibleToggleStyled} {
            color: ${rgba(colorsPalettes.carbon["500"], 0.8)};
            letter-spacing: 0.2px;
            text-transform: uppercase;
        }
    }
`;

export const StyledDropdownItem = styled(EllipsisDropdownItem)`
    padding-left: 47px;
`;
