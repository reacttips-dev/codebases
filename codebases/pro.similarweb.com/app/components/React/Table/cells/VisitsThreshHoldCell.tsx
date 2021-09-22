import * as _ from "lodash";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { CoreConditionCellRightAlign } from "../../../../../.pro-features/components/core cells/src/CoreConditionCell/CoreConditionCell";
import { FlexRow } from "../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { Injector } from "../../../../../scripts/common/ioc/Injector";

const Text = styled.div`
    margin-left: 8px;
`;

interface IVisitsThreshHoldCell {
    tooltip: string;
    value: number;
}

export const VisitsThreshHoldCell: StatelessComponent<IVisitsThreshHoldCell> = ({
    value,
    tooltip,
}) => {
    const abbrNumberFilter = Injector.get("abbrNumberFilter") as any;

    const formatValue = abbrNumberFilter(value);

    return (
        <CoreConditionCellRightAlign
            value={formatValue || "N/A"}
            Component={<ComponentWithSmallTraffic tooltip={tooltip} />}
            condition={_.isNumber(value) && value < 5000}
        />
    );
};

const ComponentWithSmallTraffic = ({ tooltip }) => {
    return (
        <FlexRow>
            <Text> {`< 5000`} </Text>
        </FlexRow>
    );
};
