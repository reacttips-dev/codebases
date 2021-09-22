import * as React from "react";
import Chart, { IChartProps } from "./Chart";
import styled from "styled-components";
import * as _ from "lodash";

export const FluidContainer = styled.div`
    display: flex;
    flex-grow: 1;
    max-width: 100%;
`;
FluidContainer.displayName = "FluidContainer";

export default class ResponsiveChart extends React.Component<IChartProps, any> {
    private reactHC: any;
    private chartContainer: any;
    setReactHC = (reactHC) => (this.reactHC = reactHC);
    setChartContainer = (chartContainer) => (this.chartContainer = chartContainer);

    componentDidMount() {
        window.addEventListener("resize", this.reflow, { capture: true });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.reflow, { capture: true });
    }

    reflow = _.debounce(() => {
        const { width, height } = this.chartContainer.getBoundingClientRect();
        this.reactHC.chart.setSize(width, height);
    }, 200);

    render() {
        const { domProps: hcDOMContainerProps = { style: {} }, ...props } = this.props;
        const domProps = {
            ...hcDOMContainerProps,
            style: {
                ...(hcDOMContainerProps.style || {}),
                flexGrow: 1,
            },
        };
        return (
            <FluidContainer ref={this.setChartContainer}>
                <Chart {...props} domProps={domProps} ref={this.setReactHC} />
            </FluidContainer>
        );
    }
}
