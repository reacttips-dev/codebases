import * as React from "react";
import combineConfigs from "../combineConfigs";
import * as _ from "lodash";

interface IWithHoverProps {
    config?: any;
    initialSelectedPoint?: number;
    children: (props: any) => JSX.Element;
    type: any;
}

const addHoverEvents = ({ type, mouseOver, mouseOut, redraw }) => {
    return {
        plotOptions: {
            [type]: {
                point: {
                    events: {
                        mouseOver,
                    },
                },
                events: {
                    mouseOut,
                },
            },
        },
        chart: {
            events: {
                redraw,
            },
        },
    };
};

//TODO should be refactored and use like parent WithHoverEvents
export class SalesRightBarWithHoverEvents extends React.Component<IWithHoverProps, any> {
    private chart: any;
    private config: any;

    constructor(props) {
        super(props);
        this.setConfig(props);
        this.state = {
            selectedPointIndex: props.initialSelectedPoint,
        };
    }

    public componentDidUpdate(prevProps) {
        if (prevProps.config !== this.props.config || prevProps.type !== this.props.type) {
            this.setConfig(this.props);
            this.forceUpdate();
        }
    }

    public render() {
        const { selectedPointIndex } = this.state;
        const { type } = this.props;
        return this.props.children({
            config: this.config,
            selectedPointIndex,
            type,
            afterRender: this.afterRender,
        });
    }

    public setConfig = ({ type, config = null }) => {
        this.config = combineConfigs(
            {
                type,
                mouseOver: this.mouseOver,
                mouseOut: this.mouseOut,
                redraw: this.redraw,
            },
            [config, addHoverEvents],
        );
    };

    public mouseOver = (e) => {
        this.chart.series[0].update(
            {
                zones: [
                    {
                        value: this.chart.series[0].data[e.target.index].x,
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                x2: 0,
                                y1: 0,
                                y2: 1,
                            },
                            stops: [
                                [0, "rgba(79,141,249,0.20)"],
                                [1, "rgba(79,141,249,0.05)"],
                            ],
                        },
                    },
                ],
            },
            false,
        );

        const currPoint = this.chart.series[0].data[e.target.index];

        const prevPoint = this.chart.series[0].data.find((point, index) => {
            if (index === this.chart.series[0].data.length - 1) {
                return false;
            }
            if (point.marker.enabled) {
                return true;
            }
        });

        if (prevPoint) {
            prevPoint.update(
                {
                    marker: {
                        enabled: false,
                    },
                },
                false,
            );
        }

        /**
         * display current point on chart
         * */
        currPoint.update(
            {
                marker: {
                    enabled: true,
                },
            },
            false,
        );
        this.chart.series[0].chart.axes[0].update({
            /**
             * add adjust label for current point
             * */
            tickPositioner: function () {
                return [
                    this.chart.series[0].chart.axes[0].dataMin,
                    this.chart.series[0].data[e.target.index].x,
                    this.chart.series[0].chart.axes[0].dataMax,
                ];
            },
        });
        this.setState({
            selectedPointIndex: e.target.index,
        });
    };

    public mouseOut = () => {
        this.markPoint();
    };

    public markPoint = (index = this.props.initialSelectedPoint) => {
        const chart = this.chart;
        if (chart && Array.isArray(chart.series)) {
            const point = chart.series[0].data[index];
            if (point) {
                point.setState("hover");
                point.state = "";
            }
        }
    };

    public afterRender = (chart) => {
        this.chart = chart;
        setTimeout(
            this.markPoint,
            _.get(chart, `options.plotOptions[${this.props.type}].animation.duration`, 1000),
        );
    };

    public redraw = () => {
        this.markPoint();
    };

    public static defaultProps = {
        initialSelectedPoint: -1,
    };
}
