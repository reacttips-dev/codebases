import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { StyledAddWebsiteButton } from "../EditableCompetitor/styles";

export const StyledWebsiteItem = styled.div`
    &:not(:last-child) {
        margin-bottom: 8px;
    }
`;

export const StyledWebsitesContainer = styled.div``;

export const StyledRankSuffix = styled.span`
    font-size: 14px;
`;

export const StyledRank = styled.div<{ isEmphasized: boolean }>`
    color: ${({ isEmphasized }) => colorsPalettes.carbon[isEmphasized ? "500" : "200"]};
    font-size: 18px;
    font-weight: ${({ isEmphasized }) => (isEmphasized ? 500 : 400)};
    height: 32px;
    line-height: 32px;
    text-align: center;

    &:not(:last-child) {
        margin-bottom: 8px;
    }
`;

export const StyledRanks = styled.div`
    margin-right: 10px;
`;

export const StyledLeaderboardListContainer = styled.div`
    display: flex;
    padding-top: 5px;

    ${StyledAddWebsiteButton} {
        margin-bottom: 0;
    }
`;
