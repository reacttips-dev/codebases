import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledIcon = styled.div`
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background-color: ${colorsPalettes.carbon[25]};
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;

    .SWReactIcons {
        svg {
            path {
                fill: ${colorsPalettes.carbon[200]};
            }
        }
    }
`;

export const StyledPhoto = styled.div<{ showPhoto: boolean }>`
    flex-shrink: 0;

    ${StyledIcon} {
        display: ${({ showPhoto }) => (showPhoto ? "none" : "flex")};
    }

    & > img {
        width: 62px;
        height: 62px;
        border-radius: 50%;
        display: ${({ showPhoto }) => (showPhoto ? "block" : "none")};
    }
`;
