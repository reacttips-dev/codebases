import * as React from "react";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import styled, { css } from "styled-components";

export const NumberRow: any = styled(FlexRow)`
    align-items: center;
    flex-direction: row-reverse;
    font-size: 14px;
    font-weight: ${({ bold }) => (bold ? 500 : 400)};
    line-height: 16px;
    color: ${({ highlighted }) => (highlighted ? css`rgba(42,61,83,0.8)` : css`#2A3D53`)};
    font-family: Roboto;
`;
NumberRow.displayName = "NumberRow";
