import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledGeneratorProspectUpgradeTip = styled.p`
    ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12 })};
    line-height: 20px;
    margin: 8px 0 0;
    text-align: center;
`;

export const StyledGeneratorProspectUpgradeSection = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: 22px;
`;

export const StyledGeneratorProspectQuotaExceeded = styled.div`
    height: 100%;
    padding-top: 49px;
`;
