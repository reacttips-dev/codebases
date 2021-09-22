import * as React from "react";
import { StatelessComponent } from "react";
import {
    ChartAndInfo,
    ChartLoaderContainer,
    InfoContainer,
    LoaderMetric,
    LoaderStyledTab,
    LoaderWrapper,
    Spacer,
    Tabs,
} from "./StyledComponents";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";

const TabPlaceholderLoader: StatelessComponent<any> = ({ id = "tabGray", last = false }) => {
    return (
        <LoaderStyledTab last={last}>
            <svg>
                <title>Rectangle 2</title>
                <desc>Created with Sketch.</desc>
                <defs>
                    <linearGradient id={id} x1="0%" x2="0%">
                        <animate
                            attributeName="x1"
                            dur="1s"
                            repeatCount="indefinite"
                            from="0%"
                            to="200%"
                        />
                        <stop offset="0%" stopColor="#f6f7f9" />
                        <stop offset="50%" stopColor="#EBF0F5" />
                        <stop offset="100%" stopColor="#f6f7f9" />
                    </linearGradient>
                </defs>
                <g id="Page-1">
                    <g id="Expanded-Mode-Loading" transform="translate(-474.000000, -546.000000)">
                        <g id="Group-9" transform="translate(474.000000, 546.000000)">
                            <path
                                fill={`url(#${id})`}
                                d="M4,0 L18,0 C20.209139,-4.05812251e-16 22,1.790861 22,4 L22,18 C22,20.209139 20.209139,22 18,22 L4,22 C1.790861,22 2.705415e-16,20.209139 0,18 L0,4 C-2.705415e-16,1.790861 1.790861,4.05812251e-16 4,0 Z M28,0 L213,0 L213,22 L28,22 L28,0 Z M29,29 L139,29 L139,43 L29,43 L29,29 Z"
                                id="Rectangle-2"
                            ></path>
                        </g>
                    </g>
                </g>
            </svg>
        </LoaderStyledTab>
    );
};

export const MetricPlaceholderLoader: StatelessComponent<any> = ({ id = "metricGray" }) => {
    return (
        <LoaderMetric>
            <defs>
                <linearGradient id={id} x1="0%" x2="0%">
                    <animate
                        attributeName="x1"
                        dur="1s"
                        repeatCount="indefinite"
                        from="0%"
                        to="200%"
                    />
                    <stop offset="0%" stopColor="#f6f7f9" />
                    <stop offset="50%" stopColor="#EBF0F5" />
                    <stop offset="100%" stopColor="#f6f7f9" />
                </linearGradient>
            </defs>
            <g id="Page-1">
                <g id="Expanded-Mode-Loading" transform="translate(-1384.000000, -700.000000)">
                    <path
                        fill={`url(#${id})`}
                        d="M1385,745 L1539,745 L1539,765 L1385,765 L1385,745 Z M1384,700 L1643,700 L1643,731 L1384,731 L1384,700 Z"
                        id="loading-element-02"
                    ></path>
                </g>
            </g>
        </LoaderMetric>
    );
};

export const GraphLoader: StatelessComponent<any> = ({ width = "840", height = "254" }) => {
    return <PixelPlaceholderLoader width={width} height={height} />;
};

export const VerticalLegendsLoader = ({
    rowsCount,
    width = "100%",
    height = 20,
}: {
    rowsCount: number;
    width: number | string;
    height: number | string;
}) => {
    return (
        <FlexColumn>
            {new Array(rowsCount).fill(0).map((row) => (
                <>
                    <PixelPlaceholderLoader width={width} height={height} />
                    <Spacer />
                </>
            ))}
        </FlexColumn>
    );
};

export interface IExpandedTableRowLoader {
    height?: number;
}

export const ExpandedTableRowLoader: StatelessComponent<IExpandedTableRowLoader> = ({ height }) => {
    return (
        <LoaderWrapper height={height}>
            <Tabs key="tabs">
                <TabPlaceholderLoader />
                <TabPlaceholderLoader />
                <TabPlaceholderLoader />
                <TabPlaceholderLoader />
                <TabPlaceholderLoader last />
            </Tabs>
            <ChartAndInfo key="chart">
                <ChartLoaderContainer>
                    <GraphLoader />
                </ChartLoaderContainer>
                <InfoContainer>
                    <MetricPlaceholderLoader />
                    <MetricPlaceholderLoader />
                </InfoContainer>
            </ChartAndInfo>
        </LoaderWrapper>
    );
};
