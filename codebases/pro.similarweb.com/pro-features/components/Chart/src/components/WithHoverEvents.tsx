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

export class WithHoverEvents extends React.Component<IWithHoverProps, any> {
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

    public mouseOver = ({ target }) => {
        this.setState({
            selectedPointIndex: target.index,
        });
    };

    public mouseOut = () => {
        this.setState({
            selectedPointIndex: this.props.initialSelectedPoint,
        });
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
