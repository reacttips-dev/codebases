import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import LeadGeneratorTitle from "./LeadGeneratorTitle";

export const StyledTitle = styled(LeadGeneratorTitle)`
    align-items: center;
    color: ${colorsPalettes.carbon[500]};
    display: flex;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    margin-bottom: 11px;

    & > ${SWReactIcons} {
        margin: 0 4px 2px;
    }
`;

export const StyledSubTitle = styled(StyledTitle)`
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-bottom: 0;
`;
