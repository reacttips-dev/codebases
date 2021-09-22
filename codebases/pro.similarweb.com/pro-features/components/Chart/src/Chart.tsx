import { ReactHighcharts } from "libraries/reactHighcharts";
import swLog from "@similarweb/sw-log";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import combineConfigs from "./combineConfigs";
import defaultConfig from "./configs/defaultConfig";
import { withAnnotation } from "./components/annotations/AnnotationHOC";
import { get } from "./components/annotations/Data/AnnotationService";
import { IAnnotation } from "./components/annotations/Data/Annotation";
import { showErrorToast } from "actions/toast_actions";
import { connect } from "react-redux";
import { i18nFilter } from "filters/ngFilters";
import { CircularProgress } from "./components/annotations/Components/CircularProgress";
import { updateAnnotations } from "./components/annotations/Helpers/DataHelper";
import { IUser } from "app/@types/ISwSettings";
import { swSettings } from "common/services/swSettings";

export interface IChartProps {
    type: string;
    config?: any;
    data: any[];
    domProps?: any;
    afterRender?: (a?) => {};
    isPureConfig?: boolean;
    isFinalConfig?: boolean;
    chartIdForAnnotations?: string;
    showError?: (a?) => {};
}
export interface IChartState {
    isLoadingAnnotation: boolean;
}

class Chart extends React.Component<IChartProps, IChartState> {
    public static propTypes = {
        type: PropTypes.string.isRequired,
        config: PropTypes.object,
        data: PropTypes.array.isRequired,
        domProps: PropTypes.any,
        afterRender: PropTypes.func,
        isPureConfig: PropTypes.bool,
        isFinalConfig: PropTypes.bool,
        chartIdForAnnotations: PropTypes.string,
    };

    public static defaultProps = {
        domProps: {
            style: {
                height: "100%",
            },
        },
        afterRender: _.identity,
        isPureConfig: true,
        isFinalConfig: false,
    };

    private reactHC: any;
    private finalConfig: any;
    private annotations: IAnnotation[];

    constructor(props) {
        super(props);
        this.state = {
            isLoadingAnnotation: false,
        };
        this.setConfig(props);
    }

    public setChart = (reactHC) => {
        this.reactHC = reactHC;
    };

    get chart() {
        return this.reactHC && this.reactHC.chart;
    }

    async componentDidMount() {
        if (this.isAnnotationEnabled()) {
            await this.loadAnnotations();
        }
    }

    public async componentDidUpdate(prevProps) {
        if (
            prevProps.data !== this.props.data ||
            prevProps.config !== this.props.config ||
            prevProps.type !== this.props.type ||
            prevProps.chartIdForAnnotations !== this.props.chartIdForAnnotations
        ) {
            this.setConfig(this.props);
            if (
                this.isAnnotationEnabled() &&
                prevProps.chartIdForAnnotations !== this.props.chartIdForAnnotations
            ) {
                await this.loadAnnotations();
            } else {
                this.forceUpdate();
            }
        }
    }

    /*
     * This method is very convenient to determine before hand if we will need to enable/show annotations
     * If annotation is not enabled, code should be very much the same as before annotations feature
     * therefore in this case we will use annotation HOC to wrap ReactHighcharts
     * The  code below determine under which conditions we enable the annotation,
     * displaying annotation in the graph and having a moving add annotaion button (when mouse move).
     */
    public isAnnotationEnabled = () => {
        const user: IUser = swSettings.user;
        return (
            !user.isFro &&
            (this.props.type === "line" || this.props.type === "area") &&
            this.props.chartIdForAnnotations
        );
    };
    /*
     * AnnotationHOC is just a higher order component for the ReactHighcharts
     * It is a pure ui component (without really side effects)
     * We do the loading here to have a generic way to load annotations for all charts.
     * We did not find any use case where we will need to fetch annotations from component above Chart component
     * however it will still be possible with litle coding effort passing annotations in Chart props and not loading it from there.
     */
    private loadAnnotations = async () => {
        try {
            this.setState({ isLoadingAnnotation: true });
            const { annotations } = await get(this.props.chartIdForAnnotations);
            this.annotations = annotations;
        } catch (e) {
            swLog.error("Error Loading Annotation", e);
            // temporarily removed following user complaints
            // until we find a better solution (SIM-35762)
            // this.props.showError(i18nFilter()("chart.annotations.loading.error"));
        } finally {
            this.setState({ isLoadingAnnotation: false });
        }
    };
    /*
     * This method update annotations in the list upon successfull add, edit, delete annotation
     * therefore this method is passed and called from AnnotationHOC higher order component,
     */
    private handleAnnotationChange = (annotation, changeType) => {
        this.annotations = updateAnnotations(this.annotations, annotation, changeType);
    };

    public render() {
        const { afterRender = _.identity, isPureConfig = true, domProps } = this.props;
        if (this.isAnnotationEnabled()) {
            const ReactHighchartsWithAnnotation = withAnnotation(ReactHighcharts);
            return (
                <div style={{ position: "relative" }}>
                    {this.state.isLoadingAnnotation ? <CircularProgress /> : null}
                    <ReactHighchartsWithAnnotation
                        config={this.finalConfig}
                        isPureConfig={isPureConfig}
                        domProps={domProps}
                        callback={afterRender}
                        ref={this.setChart}
                        annotations={this.annotations}
                        onAnnotationChange={this.handleAnnotationChange}
                        chartIdForAnnotations={this.props.chartIdForAnnotations}
                    />
                </div>
            );
        } else {
            return (
                <ReactHighcharts
                    config={this.finalConfig}
                    isPureConfig={isPureConfig}
                    domProps={domProps}
                    callback={afterRender}
                    ref={this.setChart}
                />
            );
        }
    }

    public setConfig = ({ type, data, config = null }) => {
        if (this.props.isFinalConfig) {
            this.finalConfig = combineConfigs({ data, type }, [defaultConfig, config]);
            return;
        }
        this.finalConfig = combineConfigs({ data, type }, [
            defaultConfig,
            config,
            {
                series: data,
            },
        ]);
    };
}
function mapDispatchToProps(dispatch) {
    return {
        showError: (text?: string) => dispatch(showErrorToast(text)),
    };
}
export default connect(null, mapDispatchToProps)(Chart);
