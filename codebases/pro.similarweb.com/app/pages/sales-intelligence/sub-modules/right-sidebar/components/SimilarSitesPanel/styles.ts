import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledSimilarSitesPanelContent = styled.div`
    background-color: ${colorsPalettes.bluegrey["100"]};
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
    padding-bottom: 80px;
`;

export const StyledSimilarSitesPanel = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;
