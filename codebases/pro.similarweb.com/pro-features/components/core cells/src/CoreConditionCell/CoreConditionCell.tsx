import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";

export interface ICoreConditionCellProps {
    condition: boolean;
    Component: JSX.Element;
    value: string | number;
    className?: string | [string];
}

export const CoreConditionCell: StatelessComponent<ICoreConditionCellProps> = ({
    condition,
    Component,
    value,
    className,
}) => {
    return <FlexRow className={className}>{condition ? Component : value}</FlexRow>;
};

export const CoreConditionCellRightAlign = styled(CoreConditionCell)`
    flex-direction: row-reverse;
    ${FlexRow} {
        flex-direction: row-reverse;
    }
`;
