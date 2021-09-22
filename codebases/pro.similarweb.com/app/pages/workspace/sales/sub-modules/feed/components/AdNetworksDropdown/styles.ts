import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { NoBorderButtonWrap } from "@similarweb/ui-components/dist/dropdown/src/chipdown/ChipdownStyles";
import { TextWrapper } from "@similarweb/ui-components/dist/dropdown/src/buttons/NoBorderButton";
import { CollapsibleToggleStyled } from "@similarweb/ui-components/dist/collapsible/src/CollapsibleStyles";
import View from "./View";

export const StyledAdNetworksDropdown = styled(View)`
    margin-left: 16px;
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
