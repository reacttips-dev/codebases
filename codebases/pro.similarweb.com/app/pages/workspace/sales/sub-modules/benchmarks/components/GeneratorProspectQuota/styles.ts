import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import {
    StyledGeneratorQuotaContent,
    StyledGeneratorQuotaImageContainer,
    StyledGeneratorQuotaTextContainer,
} from "../GeneratorQuota/styles";

export const StyledTipText = styled.span`
    ${mixins.setFont({ color: colorsPalettes.carbon["500"], $weight: 500, $size: 14 })};
    line-height: 16px;
    margin-right: 12px;
`;

export const StyledBottomContainer = styled.div`
    align-items: center;
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    justify-content: center;
    padding: 48px 0;
`;

export const StyledTopContainer = styled.div`
    flex-grow: 1;
`;

export const StyledGeneratorProspectQuota = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-top: 66px;

    ${StyledGeneratorQuotaContent} {
        margin-top: 0;
        padding-left: 32px;
        padding-right: 53px;
    }

    ${StyledGeneratorQuotaTextContainer} {
        padding-top: 38px;
    }

    ${StyledGeneratorQuotaImageContainer} {
        flex-basis: 228px;
        margin-right: 20px;
    }
`;
