import * as React from "react";
import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Box } from "@similarweb/ui-components/dist/box";

export const TopPageWrapper: any = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
`;

export const FlexRowStyled = styled(FlexRow)`
    justify-content: space-between;
`;

export const TitleContainer = styled.div`
    padding: 17px 16px 17px 24px;
`;

export const StyledBox = styled(Box).attrs<{ height: number; width: number | string }>((props) => ({
    width: props.width,
}))`
    height: ${({ height }) => height}px;
    display: flex;
    flex-direction: column;
`;
