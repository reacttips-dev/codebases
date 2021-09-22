import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";

export const StyledFooterButton = styled.div`
    &:not(:first-child) {
        margin-left: 8px;
    }
`;

export const StyledSimilarSitesPanelFooterInner = styled.div`
    display: flex;
    padding: 21px 24px;
`;

export const StyledSimilarSitesPanelFooter = styled.div`
    background-color: ${colorsPalettes.carbon["0"]};
    bottom: 0;
    box-shadow: 0 0 8px 4px ${rgba(colorsPalettes.carbon["200"], 0.16)};
    position: fixed;
    right: 0;
    width: 100%;
`;
