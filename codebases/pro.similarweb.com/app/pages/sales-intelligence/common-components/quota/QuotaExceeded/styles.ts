import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledQuotaExceededSubtitle = styled.p`
    ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $weight: 400, $size: 12 })};
    line-height: 20px;
    margin: 8px auto 0;
    max-width: 310px;
`;

export const StyledQuotaExceededTitle = styled.h3`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $weight: 500, $size: 16 })};
    line-height: 20px;
    margin: 0;
`;

export const StyledQuotaExceededImageContainer = styled.div`
    margin: 0 auto;
    width: 172px;
`;

export const StyledQuotaExceededContainer = styled.div`
    padding: 0 24px;
    text-align: center;
`;
