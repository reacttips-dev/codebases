import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { StyledFadeIn } from "../../styles";

export const StyledQuotaContainer = styled(StyledFadeIn)`
    align-items: center;
    background-color: transparent;
    border-radius: 6px;
    cursor: default;
    display: inline-flex;
    padding: 8px;
    user-select: none;

    & > span {
        ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon["300"] })};
        line-height: 24px;
        margin-right: 8px;
    }
`;

export const StyledTooltipContent = styled.div`
    cursor: pointer;
`;
