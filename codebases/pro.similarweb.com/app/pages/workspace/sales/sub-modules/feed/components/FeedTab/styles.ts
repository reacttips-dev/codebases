import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const StyledFeedTabContainer = styled(FlexColumn)`
    align-items: center;
    padding-bottom: 72px;
`;

export const StyledFeedLoadingContainer = styled(FlexRow)`
    align-items: center;
    justify-content: center;
    height: 400px;
`;

export const StyledFeedSettings = styled.div`
    font-size: 14px;
    color: ${colorsPalettes.carbon[500]};
`;
