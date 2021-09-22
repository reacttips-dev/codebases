import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledExpandButtonIcon = styled.div`
    & .SWReactIcons {
        & svg path {
            fill: ${colorsPalettes.carbon["300"]};
        }
    }
`;
