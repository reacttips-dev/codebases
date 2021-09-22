import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledWatermark = styled.div`
    display: flex;
    align-items: center;
`;

export const StyledTitle = styled.div`
    font-size: 12px;
    color: ${colorsPalettes.midnight[500]};
    margin-right: 6px;
`;

export const StyledWatermarkIcons = styled.div`
    & > div {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
    }

    & > div > div {
        height: 14px;
        width: 12px;
        margin: 0 5px 0 0;
    }

    .SWReactIcons {
        width: 12px;
        height: 12px;
    }

    svg {
        width: 70px;
        height: 12px;
    }
`;
