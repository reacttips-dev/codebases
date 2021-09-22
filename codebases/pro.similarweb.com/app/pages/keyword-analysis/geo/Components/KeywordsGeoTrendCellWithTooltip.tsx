import { TrendCell } from "components/React/Table/cells";
import { ITrendCellProps, TrendContainer } from "components/React/Table/cells/TrendCell";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import dayjs from "dayjs";
import React from "react";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

const useConfig = ({ mouseOver }) => {
    return useCallback(() => {
        return {
            chart: {
                marginTop: 5,
                marginRight: 5,
                marginBottom: 5,
                marginLeft: 5,
                zoomType: null,
            },
            plotOptions: {
                series: {
                    marker: {
                        states: {
                            hover: {
                                enabled: true,
                                radius: 4,
                            },
                        },
                    },
                    states: {
                        hover: {
                            halo: {
                                size: 0,
                            },
                        },
                    },
                    point: {
                        events: {
                            mouseOver: mouseOver,
                        },
                    },
                },
            },
        };
    }, [mouseOver]);
};
const Graph = React.memo((props: ITrendCellProps) => <TrendCell {...props} />);
Graph.displayName = "Graph";

interface IPoint {
    x: number;
    y: number;
    plotX: number;
    plotY: number;
}

function getTooltipText(point) {
    if (!point?.x) {
        return null;
    }
    //const series = point.series;
    /*const prevPoint = series.points[point.index - 1];
    if (!prevPoint) {
        return null;
    }*/
    const thisMonth = dayjs.utc(point.x).format("MMM, YYYY");

    return (
        <TooltipTextWrapper>
            {thisMonth}
            {/*{' '}
            <ChangeValue
                descriptionText={''}
                value={numeral(change).format('0[.]00%').toUpperCase()}
                isDecrease={change < 0}
            />{' '}
            compared to {prevMonth}*/}
        </TooltipTextWrapper>
    );
}

export function KeywordsGeoTrendCellWithTooltip(props) {
    const ref = React.useRef<HTMLDivElement>();
    const [point, setPoint] = useState();
    const callbacks = useMemo(
        () => ({
            mouseOver() {
                setPoint(this);
                setTimeout(() => {
                    const event = new MouseEvent("mouseover", {
                        view: window,
                        bubbles: true,
                        cancelable: true,
                    });
                    ref?.current?.dispatchEvent?.(event);
                }, 50);
            },
        }),
        [],
    );
    const config = useConfig(callbacks);
    const tooltipText = getTooltipText(point);
    return (
        <TrendCellWithTooltipContainer onMouseLeave={() => setPoint(null)}>
            <ToolTipContainer point={point}>
                {!!tooltipText && (
                    <PlainTooltip
                        variation={"white"}
                        maxWidth={290}
                        text={tooltipText}
                        enabled={!!tooltipText}
                    >
                        <div>
                            <div ref={ref} />
                        </div>
                    </PlainTooltip>
                )}
            </ToolTipContainer>
            <Graph {...props} config={config} />
        </TrendCellWithTooltipContainer>
    );
}

const TrendCellWithTooltipContainer = styled.div`
    ${TrendContainer} {
        pointer-events: initial;
    }
`;

const ToolTipContainer = styled.div<{ point: IPoint }>`
    position: absolute;
    top: ${(p) => p.point?.plotY - 5 || 0}px;
    left: ${(p) => p.point?.plotX + 10 || 0}px;
    width: 1px;
    height: 1px;
    z-index: -1;
`;

const TooltipTextWrapper = styled.div`
    .ChangeValue-arrow {
        margin-bottom: -1px;
    }
`;
