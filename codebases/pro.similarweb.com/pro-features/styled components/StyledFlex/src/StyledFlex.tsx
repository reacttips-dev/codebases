import * as React from "react";
import styled, { css } from "styled-components";

// helpers methods
const alignItems: any = ({ alignItems }) =>
    alignItems &&
    css`
        align-items: ${alignItems};
    `;
const justifyContent: any = ({ justifyContent }) =>
    justifyContent &&
    css`
        justify-content: ${justifyContent};
    `;

const BaseFlex = styled.div<{ alignItems?: string; justifyContent?: string }>`
    display: flex;
    ${alignItems};
    ${justifyContent};
`;
export const FlexRow: any = styled(BaseFlex)`
    flex-direction: row;
`;
FlexRow.displayName = "FlexRow";

export const FlexColumn: any = styled(BaseFlex)`
    flex-direction: column;
`;
FlexColumn.displayName = "FlexColumn";

export const FlexRowReverse = styled(FlexRow)`
    flex-direction: row-reverse;
`;
FlexRowReverse.displayName = "FlexRowReverse";

export const FlexColumnReverse = styled(FlexColumn)`
    flex-direction: column-reverse;
`;
FlexColumnReverse.displayName = "FlexColumnReverse";

export const RightFlexRow = styled(FlexRow)`
    justify-content: flex-end;
    align-items: center;
`;
RightFlexRow.displayName = "RightFlexRow";

export const CenteredFlexRow = styled(FlexRow)`
    align-items: center;
    justify-content: center;
`;
CenteredFlexRow.displayName = "CenteredFlexRow";

export const CenteredFlexColumn = styled(FlexColumn)`
    align-items: center;
    justify-content: center;
`;
CenteredFlexColumn.displayName = "CenteredFlexColumn";
