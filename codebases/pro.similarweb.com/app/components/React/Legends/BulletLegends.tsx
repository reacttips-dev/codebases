import { LegendBullet } from "@similarweb/ui-components/dist/legend";
import { CHART_COLORS } from "constants/ChartColors";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";
import styled from "styled-components";

interface ILegendProps {
    legendItems: any[];
}
export const FlexBox = styled.div<{}>`
    display: flex;
`;

const colors = CHART_COLORS.compareMainColors;

export const BulletLegends: React.FunctionComponent<ILegendProps> = ({ legendItems }) => {
    const legends = legendItems.map((item, index) => {
        return (
            <LegendBullet
                key={index}
                text={item.name}
                labelColor={item.color || colors[index % colors.length]}
                setOpacity={item.setOpacity || false}
            />
        );
    });
    return <FlexBox>{legends}</FlexBox>;
};
export default SWReactRootComponent(BulletLegends, "BulletLegends");
