import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";

export const StyledFeedsListContainer = styled(FlexColumn)`
    background-color: ${colorsPalettes.bluegrey["100"]};
    box-sizing: border-box;
    max-width: 100%;
    padding: 0 24px;
    margin-bottom: 50px;
`;

export const StyledEmptyStateNews = styled.div`
    margin-bottom: 50px;
`;
