import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";

export const StyledEmptyStateTitle = styled.div`
    margin-top: 16px;
    text-align: center;

    span {
        color: ${colorsPalettes.carbon["500"]};
        font-size: 14px;
        font-weight: 500;
    }
`;

export const StyledEmptyStateSubtitle = styled(StyledEmptyStateTitle)`
    line-height: 20px;
    margin-top: 2px;
    max-width: 275px;

    span {
        color: ${rgba(colorsPalettes.midnight["500"], 0.54)};
        font-weight: 400;
    }
`;

export const StyledEmptyStateContainer = styled(FlexColumn)`
    align-items: center;
    margin-top: 80px;

    svg {
        display: block;
    }
`;
