import { colorsPalettes, colorsSets, rgba } from "@similarweb/styles";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import * as React from "react";
import * as _ from "lodash";
import { ReactNode, StatelessComponent } from "react";
import styled, { css } from "styled-components";

export const normalizeValues = (values: Array<number | number[]>, inverted = false) => {
    const flattenValues = values.map((v) => {
        if (Array.isArray(v)) {
            return _.sum(v);
        } else {
            return v;
        }
    });
    if (inverted) {
        const minValue = Math.min(...flattenValues);
        return flattenValues.map((value) => 100 * (minValue / value));
    } else {
        const maxValue = Math.max(...flattenValues);
        return flattenValues.map((value) => 100 * (value / maxValue));
    }
};

export interface ITrendsBarValue {
    value: number | number[];
    tooltip?: ReactNode;
}

interface ITrendsBarProps {
    values: ITrendsBarValue[];
    barsLimit?: number;
    inverted?: boolean;
    colorsSet?: string[];
}

export const Bar = styled.div.attrs<{
    height: number;
    index: number;
    color: "string";
    multi: boolean;
}>((props) => ({
    "data-automation-trend-bar": props.index.toString(),
}))<{ height: number; index: number; color: "string"; multi: boolean }>`
    height: ${({ height }) => `${height}%`};
    min-height: ${({ multi }) => (multi ? `0px` : `1px`)};
    width: 5px;
    background-color: ${({ color }) => color};
    opacity: 1;
    cursor: pointer;
    margin-right: 4px;
`;

const BarWrapper = styled.div`
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    &:hover {
        ${Bar} {
            opacity: 1 !important;
        }
    }
`;

const TrendsBarContainer = styled.div`
    display: flex;
    align-items: flex-end;
    height: 100%;
    justify-content: center;
    &:hover {
        ${Bar} {
            opacity: 0.6;
        }
    }
`;

const BarContainer = ({ heights, colorsSet, multi }) => {
    return (
        <BarWrapper>
            {heights.map((h, index) => {
                // if the height is > 0 we want to make the bar with min-height: 1px
                // otherwise, use the default 'multi' prop that can decide if to use min-height or not
                return (
                    <Bar
                        key={index}
                        height={h}
                        index={index}
                        color={colorsSet[index]}
                        multi={h > 0 ? false : multi}
                    />
                );
            })}
        </BarWrapper>
    );
};

export const TrendsBar: StatelessComponent<ITrendsBarProps> = ({
    values,
    barsLimit,
    inverted,
    colorsSet,
}) => {
    if (!values) {
        return <>N/A</>;
    }
    const normalized = normalizeValues(
        values.map((item) => item.value),
        inverted,
    );
    return (
        <TrendsBarContainer>
            {values
                .map((item, index) => {
                    const valueIsArray = Array.isArray(item.value);
                    let totalHeight = 0;
                    if (valueIsArray) {
                        totalHeight = _.sum(item.value as number[]);
                    }
                    const bars = valueIsArray ? (
                        <BarContainer
                            key={index}
                            heights={(item.value as number[]).map(
                                (v) => (v / totalHeight) * normalized[index],
                            )}
                            colorsSet={colorsSet}
                            multi={true}
                        />
                    ) : (
                        <BarContainer
                            key={index}
                            heights={[normalized[index]]}
                            colorsSet={colorsSet}
                            multi={false}
                        />
                    );
                    if (item.tooltip && normalized[index] > 0) {
                        return (
                            <PopupHoverContainer
                                key={index}
                                content={() => (
                                    <div style={{ minWidth: "90px", backgroundColor: "#FFF" }}>
                                        {item.tooltip}
                                    </div>
                                )}
                                config={{
                                    enabled: true,
                                    placement: "top",
                                    cssClass: "Popup-element-wrapper--trendsBar",
                                }}
                            >
                                <div style={{ height: "100%", flexGrow: 1, maxWidth: "9px" }}>
                                    {bars}
                                </div>
                            </PopupHoverContainer>
                        );
                    } else {
                        return bars;
                    }
                })
                .slice(barsLimit ? values.length - barsLimit : null)}
        </TrendsBarContainer>
    );
};

TrendsBar.defaultProps = {
    values: [],
    barsLimit: 0,
    inverted: false,
    colorsSet: colorsSets.b1.toArray(),
};
