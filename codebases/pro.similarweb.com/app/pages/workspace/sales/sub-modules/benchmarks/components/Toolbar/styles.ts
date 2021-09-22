import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import { IconButton } from "@similarweb/ui-components/dist/button";

export const StyledToolbar = styled.div`
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    position: relative;
    height: 57px;
    box-shadow: 0 4px 8px 0 rgba(118, 123, 129, 0.16);
    background-color: ${colorsPalettes.carbon["0"]};
    z-index: 1;
`;

export const StyledIcon = styled(SWReactIcons)`
    height: 24px;
    width: 24px;
`;

export const StyledButtonIcon = styled(IconButton)`
    && {
        background-color: transparent;
    }
    .SWReactIcons svg {
        width: 24px;
        height: 24px;
    }
`;
