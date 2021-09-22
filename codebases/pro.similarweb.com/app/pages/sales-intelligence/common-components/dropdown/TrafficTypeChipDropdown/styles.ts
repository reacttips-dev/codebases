import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import {
    NoBorderButton,
    TextWrapper,
} from "@similarweb/ui-components/dist/dropdown/src/buttons/NoBorderButton";

export const StyledTrafficTypeChipButton = styled(NoBorderButton)`
    background-color: ${rgba(colorsPalettes.carbon["500"], 0.1)};
    border-radius: 40px;
    padding: 4px 12px;
    height: 32px;
    box-sizing: border-box;
    ${TextWrapper} {
        &,
        * {
            font-size: 13px;
        }
    }

    &:hover {
        background-color: ${rgba(colorsPalettes.carbon[500], 0.16)};
    }
`;
