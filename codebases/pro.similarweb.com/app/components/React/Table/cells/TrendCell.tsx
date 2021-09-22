import * as _ from "lodash";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import CoreTrendCell from "../../../../../.pro-features/components/core cells/src/CoreTrendCell/CoreTrendCell";
import combineConfigs from "components/Chart/src/combineConfigs";

export interface ITrendCellProps {
    value: any[];
    row: any;
    params?: object;
    config?: object;
}

export const TrendContainer: any = styled.div`
    top: -4px;
    position: relative;
    pointer-events: none;
`;
TrendContainer.displayName = "TrendContainer";

const AlignRight = styled.div`
    text-align: right;
`;

export const TrendCell: StatelessComponent<ITrendCellProps> = ({
    value,
    row,
    params,
    config = {},
}) => {
    if (_.isEmpty(value)) {
        return <AlignRight>N/A</AlignRight>;
    }
    const trendData = [
        {
            name: `${row.field}_trend`,
            data: _.sortBy(
                value.map((item) => [new Date(item.Key || item.key).getTime(), item.Value]),
            ),
        },
    ];
    const resConfig = combineConfigs({ value, row, params }, [
        {
            chart: {
                height: 30,
            },
            yAxis: {
                min: 0,
            },
        },
        config,
    ]);
    return (
        <TrendContainer>
            <AlignRight>
                <CoreTrendCell data={trendData} config={resConfig} params={params} />
            </AlignRight>
        </TrendContainer>
    );
};
TrendCell.displayName = "TrendCell";
