import styled, { css } from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledGeneratorQuotaRemainingText = styled.p<{ isBold: boolean }>`
    margin: 8px 0 0;
    ${({ isBold }) =>
        isBold &&
        css`
            font-weight: 700;
            color: ${colorsPalettes.carbon["500"]};
        `};
`;

export const StyledGeneratorQuotaText = styled.p`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $weight: 400, $size: 14 })};
    line-height: 22px;
    margin: 0;
`;

export const StyledQuotaButtonContainer = styled.div`
    margin-top: 48px;
`;

export const StyledGeneratorQuotaTextContainer = styled.div`
    padding-top: 16px;
`;

export const StyledGeneratorQuotaImageContainer = styled.div`
    flex: 0 0 154px;
    margin-right: 19px;
`;

export const StyledGeneratorQuotaContent = styled.div`
    display: flex;
    margin-top: 22px;
    padding: 0 63px;
`;

export const StyledGeneratorQuotaTitle = styled.h3`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $weight: 500, $size: 26 })};
    margin: 0;
    padding: 0 24px 0 72px;
`;

export const StyledGeneratorQuota = styled.div``;
