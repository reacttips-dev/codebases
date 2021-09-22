import styled from "styled-components";
import { rgba, colorsPalettes } from "@similarweb/styles";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";

export const StyledTabContainer = styled(FlexColumn)`
    padding-bottom: 72px;
`;

export const StyledFeedGroupTitle = styled.div`
    span {
        color: ${rgba(colorsPalettes.carbon["500"], 0.8)};
        font-size: 14px;
        transition: all 200ms;
    }

    margin-bottom: 10px;
`;

export const StyledFeedTitle = styled.div`
    margin: 0 24px;

    > span {
        color: ${colorsPalettes.carbon["500"]};
        font-size: 16px;
        font-weight: 500;
    }
`;

export const ShadowedFeedContainer = styled.div`
    background-color: ${colorsPalettes.carbon["0"]};
    border-radius: 6px;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    box-sizing: border-box;
`;

export const StyledFeedContainer = styled(ShadowedFeedContainer)`
    margin-bottom: 8px;
    padding: 24px 0;
`;
