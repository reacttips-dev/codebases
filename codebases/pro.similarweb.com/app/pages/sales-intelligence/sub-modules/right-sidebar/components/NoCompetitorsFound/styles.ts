import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledDescriptionContainer = styled.div`
    margin-left: 20px;
    padding-right: 40px;

    & p {
        ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
        line-height: 22px;
        margin: 0;
    }
`;

export const StyledImageContainer = styled.div`
    flex: 0 0 228px;
    min-height: 193px;
`;

export const StyledTipText = styled.span`
    ${mixins.setFont({ $color: colorsPalettes.carbon["300"] })};
    margin-top: 9px;
`;

export const StyledButtonDescription = styled.p`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
    line-height: 22px;
    margin: 0;
    max-width: 380px;
    text-align: center;
`;

export const StyledButtonContainer = styled.div`
    margin-top: 16px;
`;

export const StyledBottomSection = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: 56px;
`;

export const StyledTopSection = styled.div`
    align-items: center;
    display: flex;
`;

export const StyledNoCompetitorsContainer = styled.div``;
