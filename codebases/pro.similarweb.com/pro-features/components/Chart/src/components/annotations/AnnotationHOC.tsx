import React from "react";
import * as _ from "lodash";
import { AnnotationCallout } from "./Components/AnnotationCallout";
import { CircularProgress } from "./Components/CircularProgress";
import {
    AddButtonContainer,
    AddIconButton,
    CalloutInnerContainer,
} from "./Components/StyledComponents";
import { AnnotationsPanel } from "./Components/AnnotationsPanel";
import { AddEditPanel } from "./Components/AddEditPanel";
import {
    getUpdatedDomPropsHeight,
    getUpdatedConfigWithNewBottomHeight,
} from "./Helpers/ConfigHelper";
import {
    getShortFormatedDate,
    getCurrentUTCTimestamp,
    hasNoChartData,
    getAnnotationsByChartTimestampDataPoint,
    preProcessAnnotationsToEdit,
    addAnnotationToChart,
    updateItemInListById,
    deleteItemInListById,
    UpdateType,
} from "./Helpers/DataHelper";
import { add, update, remove } from "./Data/AnnotationService";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { IUser } from "app/@types/ISwSettings";
import { showErrorToast, showSuccessToast } from "actions/toast_actions";
import { connect } from "react-redux";
import swLog from "@similarweb/sw-log";
import { IAnnotation } from "./Data/Annotation";

export interface IAnnotationProps {
    type: string;
    config?: any;
    data: any[];
    domProps?: any;
    callback?: (a?) => {};
    forwardedRef: any;
    isPureConfig?: boolean;
    isFinalConfig?: boolean;
    chartIdForAnnotations: string;
    annotations: IAnnotation[];
    onAnnotationChange: (annotation, changeType) => void;
    showSuccess: (a?) => {};
    showError: (a?) => {};
}
export interface IAnnotationState {
    isAddButtonVisible: boolean;
    addButtonX: number;
    addButtonY: number;
    addButtonTime: number;
    addButtonXSnapshot: number;
    addButtonTimeSnapshot: number;
    openCallout: boolean;
    openCalloutTarget: Element;
    annotationsForCallout: IAnnotation[];
    annotationForAddEditPanel: IAnnotation;
    annotationCountTime: number;
    annotationCountX: number;
    isFromClickOnAnnotation: boolean;
    isAdding: boolean;
    isLoading: boolean;
}
export const withAnnotation = (Component) => {
    class AnnotationHOC extends React.Component<IAnnotationProps, IAnnotationState> {
        private divRef;
        private addButtonRef;
        private addButtonWidth;
        private addButtonHeight;
        private chart;
        private translate;
        private annotationsData: IAnnotation[]; //whole loaded list of annotations
        private annotationsChart = {}; // map of annotation by timestamp (chart data point timestamp)
        private readonly user: IUser;
        private isUnmounting = false;
        constructor(props) {
            super(props);
            this.user = swSettings.user;
            this.translate = i18nFilter();
            this.state = {
                isAddButtonVisible: false,
                addButtonX: undefined,
                addButtonY: undefined,
                addButtonTime: undefined,
                addButtonXSnapshot: undefined,
                addButtonTimeSnapshot: undefined,
                annotationsForCallout: undefined,
                openCallout: false,
                openCalloutTarget: undefined,
                annotationForAddEditPanel: undefined,
                annotationCountTime: undefined,
                annotationCountX: undefined,
                isFromClickOnAnnotation: true,
                isAdding: true,
                isLoading: false,
            };
            this.annotationsData =
                props.annotations !== undefined || props.annotations !== null
                    ? props.annotations
                    : [];
        }

        componentDidMount() {
            const buttonStyle = window.getComputedStyle(this.addButtonRef);
            if (buttonStyle.width.endsWith("px") && buttonStyle.height.endsWith("px")) {
                this.addButtonWidth = parseFloat(buttonStyle.width.split("px")[0]);
                this.addButtonHeight = parseFloat(buttonStyle.height.split("px")[0]);
            }
            this.chartRenderAnnotations();
            Component.Highcharts.addEvent(this.chart, "redraw", this.redraw);
        }

        componentWillUnmount() {
            this.isUnmounting = true;
            Component.Highcharts.removeEvent(this.chart, "redraw", this.redraw);
        }

        /*
         * This method is called when window resize, or when we zoom in or reset zoom in Highcharts
         */
        redraw = _.debounce(() => {
            if (this.isUnmounting) return; // fix warning
            this.clearAllChartAnnotations();
            this.annotationsChart = {};
            this.chartRenderAnnotations();
            this.setState({
                isAddButtonVisible: false,
            });
        }, 200);

        clearAllChartAnnotations = () => {
            for (const timestamp in this.annotationsChart) {
                this.chart.removeAnnotation("" + timestamp);
            }
        };
        /*
         * this method render annotation in Highcharts
         */
        private chartRenderAnnotations = async () => {
            // if all series are not visible or if we did not received data yet
            if (!(this.annotationsData?.length > 0) || hasNoChartData(this.chart)) {
                return;
            }
            const extremesX = this.chart?.xAxis[0].getExtremes();
            this.annotationsChart = getAnnotationsByChartTimestampDataPoint(
                this.chart,
                this.annotationsData,
            );
            // Add to chart
            for (const annotationsChartTimestamp in this.annotationsChart) {
                const timestamp: number = +annotationsChartTimestamp;
                const chartX = this.chart.xAxis[0].toPixels(timestamp) - this.chart.xAxis[0].left;
                if (timestamp >= extremesX.min && timestamp <= extremesX.max) {
                    this.addAnnotationCountToChart(timestamp, chartX);
                }
            }
        };
        /*
         * This method is to listen on mouse move on the Chart in order to display
         * the Add Annotation Button above the chart xAxis, according to the coordinate of the mouse move.
         */
        private handleMouseMove = (event) => {
            if (hasNoChartData(this.chart) || this.state.openCallout) {
                return;
            }
            const { left } = this.divRef.getBoundingClientRect();
            const x = event.pageX - left;
            const data = this.chart.series[0].data; // we can use any series, since we are looking at x value (i.e data[0].x) or length they are all the same
            let pos = 0;
            if (data && data.length >= 2) {
                const xmax = this.chart.xAxis[0].toPixels(data[data.length - 1].x);
                const xmin = this.chart.xAxis[0].toPixels(data[0].x);
                const d = (xmax - xmin) / (data.length - 1);
                pos = Math.floor((x - xmin + d / 2) / d);
            }
            // Mouse is outside the xAxis (we are in the chart but on the left or right of the region of the xAxis of the chart)
            if (data[pos] === undefined) {
                return;
            }
            // In case we did zoom we need to take it into account when showing the add to highchart moving button
            const extremes = this.chart?.xAxis[0].getExtremes();
            if (!extremes || (data[pos].x >= extremes.min && data[pos].x <= extremes.max)) {
                const buttonX = this.chart.xAxis[0].toPixels(data[pos].x);
                const buttonY = this.chart.xAxis[0].height + this.chart.plotTop;
                this.setState({
                    isAddButtonVisible: true,
                    addButtonX: buttonX,
                    addButtonY: buttonY,
                    addButtonTime: data[pos].x,
                });
            }
        };
        /*
         * Handler when we click on the Add annotation button that move when we move the mouse on the chart
         */
        private handleAddButtonClicked = (e) => {
            const target = e?.currentTarget; // closure
            this.setState((state: IAnnotationState) => {
                return {
                    openCallout: true,
                    openCalloutTarget: target,
                    addButtonXSnapshot: state.addButtonX,
                    addButtonTimeSnapshot: state.addButtonTime,
                    annotationForAddEditPanel: {
                        timestamp: state.addButtonTime,
                        createdTimestamp: getCurrentUTCTimestamp(),
                        text: "",
                        userFullName: `${this.user.firstname} ${this.user.lastname}`,
                    },
                    isAdding: true,
                    isFromClickOnAnnotation: false,
                };
            });
        };
        /*
         * Handler called when we click the Add annotation button in the list of annotation Callout.
         */
        private onCalloutAddClick = () => {
            const annotation = {
                timestamp: this.state.annotationCountTime,
                createdTimestamp: getCurrentUTCTimestamp(),
                text: "",
                userFullName: `${this.user.firstname} ${this.user.lastname}`,
            };
            this.setState({
                annotationForAddEditPanel: annotation,
                isAdding: true,
                isFromClickOnAnnotation: true,
            });
        };
        /*
         * Handler when we click the Edit link button, when annotation in the list callout is editable.
         */
        private onCalloutEditClick = (annotation: IAnnotation) => {
            this.setState({
                annotationForAddEditPanel: annotation,
                isAdding: false,
                isFromClickOnAnnotation: true,
            });
        };
        /*
         * Handler when we are in add or edit panel, coming from the callout,
         * and we click on the back button
         */
        private onCalloutBackClick = () => {
            if (!this.state.isLoading) {
                this.setState({
                    annotationForAddEditPanel: undefined,
                });
            }
        };
        /* After update the backend we always update the annotation in models
         */
        private updateAnnotationInModels = (annotation) => {
            this.annotationsData = updateItemInListById(this.annotationsData, annotation);
            this.annotationsChart[this.state.annotationCountTime] = updateItemInListById(
                this.annotationsChart[this.state.annotationCountTime],
                annotation,
            );
            this.props.onAnnotationChange(annotation, UpdateType.Updated);
        };
        private handleCalloutEditAnnotation = async () => {
            TrackWithGuidService.trackWithGuid("chart.annotations.edit", "click", {
                chart: this.props.chartIdForAnnotations,
            });
            this.setState({
                isLoading: true,
            });
            try {
                const result = await update(
                    this.props.chartIdForAnnotations,
                    this.user,
                    this.state.annotationForAddEditPanel,
                );
                if (result?.updated) {
                    // update the list with new value
                    this.updateAnnotationInModels(this.state.annotationForAddEditPanel);
                    // Get back to list
                    this.setState({
                        annotationsForCallout: updateItemInListById(
                            this.state.annotationsForCallout,
                            this.state.annotationForAddEditPanel,
                        ),
                        annotationForAddEditPanel: undefined,
                        isLoading: false,
                    });
                    this.props.showSuccess(this.translate("chart.annotations.edit.success"));
                } else {
                    this.processError(
                        result,
                        "Error Editing Annotation",
                        "chart.annotations.edit.error",
                    );
                }
            } catch (e) {
                this.processError(e, "Error Editing Annotation", "chart.annotations.edit.error");
            }
        };
        private addAnnotationInModels = (annotation) => {
            this.annotationsData.push(annotation);
            this.annotationsChart[annotation.timestamp].push(annotation); // add new annotation to the list
            this.props.onAnnotationChange(annotation, UpdateType.Added);
        };
        private handleCalloutAddAnnotation = async () => {
            TrackWithGuidService.trackWithGuid("chart.annotations.add", "click", {
                chart: this.props.chartIdForAnnotations,
            });
            const chartX = this.state.isFromClickOnAnnotation
                ? this.state.annotationCountX
                : this.state.addButtonXSnapshot - this.chart.xAxis[0].left;
            const chartT = this.state.isFromClickOnAnnotation
                ? this.state.annotationCountTime
                : this.state.addButtonTimeSnapshot;
            this.setState({
                isLoading: true,
            });
            const annotationList = this.annotationsChart[chartT];
            const annotationToAdd: IAnnotation = {
                ...this.state.annotationForAddEditPanel,
            };
            try {
                const addedAnnotation = await add(
                    this.props.chartIdForAnnotations,
                    this.user,
                    annotationToAdd,
                );
                if (addedAnnotation?.id) {
                    if (!annotationList) {
                        this.annotationsChart[addedAnnotation.timestamp] = [];
                    } else {
                        // we must remove and add an annotation to update it in chart
                        this.chart.removeAnnotation("" + addedAnnotation.timestamp); // id must be a string for chart
                    }
                    this.addAnnotationInModels(addedAnnotation);
                    const annotationFromHighchart = this.addAnnotationCountToChart(chartT, chartX);
                    if (this.state.isFromClickOnAnnotation) {
                        // the callout is necessarily opened and we must update the target since
                        // we updated the annotation in the chart
                        const target =
                            annotationFromHighchart?.labels?.length > 0
                                ? annotationFromHighchart?.labels[0].graphic?.div
                                : undefined;
                        this.setState({
                            isLoading: false,
                            annotationForAddEditPanel: undefined,
                            annotationsForCallout: preProcessAnnotationsToEdit(
                                this.annotationsChart[addedAnnotation.timestamp],
                            ),
                            openCalloutTarget: target,
                        });
                    } else {
                        this.setState({
                            openCallout: false,
                            isLoading: false,
                            annotationForAddEditPanel: undefined,
                            annotationsForCallout: undefined,
                        });
                    }
                    this.props.showSuccess(this.translate("chart.annotations.add.success"));
                } else {
                    this.processError(
                        addedAnnotation,
                        "Error Adding Annotation, missing annotation id",
                        "chart.annotations.add.error",
                    );
                }
            } catch (e) {
                this.processError(e, "Error Adding Annotation", "chart.annotations.add.error");
            }
        };
        /* Handler when we type text for adding or editing an annotion we update the state with new value
         */
        private onTextAreaChange = (value: string, max: number) => {
            let annotationText = value;
            if (value && max && value.length > max) {
                annotationText = value.substring(0, max);
            }
            this.setState({
                annotationForAddEditPanel: {
                    ...this.state.annotationForAddEditPanel,
                    text: annotationText,
                },
            });
        };
        /* To add annotation in highchart
         */
        private addAnnotationCountToChart = (timestamp: number, chartX: number) => {
            return addAnnotationToChart(
                this.chart,
                timestamp,
                chartX,
                this.annotationsChart[timestamp].length,
                function onClickHandler(e) {
                    if (!this.state.openCallout) {
                        this.setState({
                            openCallout: true,
                            openCalloutTarget: e?.target,
                            annotationCountTime: timestamp,
                            annotationCountX: chartX,
                            annotationsForCallout: preProcessAnnotationsToEdit(
                                this.annotationsChart[timestamp],
                            ),
                        });
                    }
                }.bind(this),
            );
        };
        private deleteAnnotationInModels = (annotation) => {
            this.annotationsData = deleteItemInListById(this.annotationsData, annotation.id);
            this.annotationsChart[this.state.annotationCountTime] = deleteItemInListById(
                this.annotationsChart[this.state.annotationCountTime],
                annotation.id,
            );
            this.props.onAnnotationChange(annotation, UpdateType.Deleted);
        };
        private processError = (error: any, logErrorTitle: string, toasterErrorKeyMsg: string) => {
            this.setState({
                isLoading: false,
            });
            swLog.error(logErrorTitle, error);
            this.props.showError(this.translate(toasterErrorKeyMsg));
        };
        private handleCalloutDeleteAnnotation = async (annotation: IAnnotation) => {
            TrackWithGuidService.trackWithGuid("chart.annotations.delete", "click", {
                chart: this.props.chartIdForAnnotations,
            });
            const chartX = this.state.annotationCountX;
            const chartT = this.state.annotationCountTime;
            this.setState({
                isLoading: true,
            });
            try {
                const result = await remove(
                    this.props.chartIdForAnnotations,
                    this.user,
                    annotation,
                );
                if (result?.deleted) {
                    this.deleteAnnotationInModels(annotation);
                    this.chart.removeAnnotation("" + chartT);
                    if (this.annotationsChart[chartT].length > 0) {
                        // update the count
                        const annotationFromHighchart = this.addAnnotationCountToChart(
                            chartT,
                            chartX,
                        );
                        // Get back to list and update the target (since we updated annotation in the chart)
                        // and in case user scroll
                        const target =
                            annotationFromHighchart?.labels?.length > 0
                                ? annotationFromHighchart?.labels[0].graphic?.div
                                : undefined;
                        // Get back to list
                        this.setState({
                            annotationsForCallout: deleteItemInListById(
                                this.state.annotationsForCallout,
                                annotation.id,
                            ),
                            openCalloutTarget: target,
                            annotationForAddEditPanel: undefined,
                            isLoading: false,
                        });
                    } else {
                        // No annotations left clean and close callout
                        this.setState({
                            annotationsForCallout: undefined,
                            annotationForAddEditPanel: undefined,
                            openCalloutTarget: undefined,
                            openCallout: false,
                            isLoading: false,
                        });
                    }
                    this.props.showSuccess(this.translate("chart.annotations.delete.success"));
                } else {
                    this.processError(
                        result,
                        "Error Deleting Annotation",
                        "chart.annotations.delete.error",
                    );
                }
            } catch (e) {
                this.processError(e, "Error Deleting Annotation", "chart.annotations.delete.error");
            }
        };
        /* Handler when clicking close button in callout
         */
        private handleCloseCallout = () => {
            if (!this.state.isLoading) {
                this.setState({
                    openCallout: false,
                    annotationForAddEditPanel: undefined,
                    annotationsForCallout: undefined,
                });
            }
        };

        public render() {
            const { forwardedRef, callback: afterRender, domProps, config, ...rest } = this.props;
            // we have added a layer to listen for mouse move so the props height should go
            // to the div that listen the mouse move, and the Highchart component should be at 100% as shown below.
            const chartDomProps = getUpdatedDomPropsHeight(domProps, "100%");
            // provide enough space in chart bottom to have enough room to show annotations without being cut
            const chartConfig = getUpdatedConfigWithNewBottomHeight(config);
            return (
                <div
                    ref={(divRef) => {
                        this.divRef = divRef;
                    }}
                    onMouseMove={this.handleMouseMove}
                    onMouseOut={() => this.setState({ isAddButtonVisible: false })}
                    style={{
                        height: domProps?.style?.height ? `${domProps.style.height}` : "100%",
                        position: "relative",
                    }}
                >
                    <AddButtonContainer
                        title={this.translate("chart.annotations.add.icon-button.tooltip")}
                        ref={(addButtonRef) => {
                            this.addButtonRef = addButtonRef;
                        }}
                        style={{
                            visibility: this.state.isAddButtonVisible ? "visible" : "hidden",
                            left: `${this.state.addButtonX - this.addButtonWidth / 2}px`,
                            top: `${this.state.addButtonY - this.addButtonHeight / 2}px`,
                        }}
                        onClick={this.handleAddButtonClicked}
                    >
                        <AddIconButton
                            type="flat"
                            iconName="add-annotation"
                            iconSize={"sm"}
                            placement="left"
                        />
                    </AddButtonContainer>
                    {this.state.openCallout ? (
                        <AnnotationCallout
                            config={{
                                maxWidth: 309,
                                cssClass: "chart-annotations-callout-container",
                                cssClassContent: "chart-annotations-callout-content",
                                placement: "top",
                                autoPlacement: true,
                            }}
                            onClickOut={this.handleCloseCallout}
                            target={this.state.openCalloutTarget}
                        >
                            <CalloutInnerContainer>
                                {this.state.isLoading ? <CircularProgress /> : null}
                                {!this.state.annotationForAddEditPanel ? (
                                    <AnnotationsPanel
                                        headerText={this.translate(
                                            "chart.annotations.list.header",
                                            {
                                                date: getShortFormatedDate(
                                                    this.state.annotationCountTime,
                                                ),
                                            },
                                        )}
                                        annotations={this.state.annotationsForCallout}
                                        onEditClick={this.onCalloutEditClick}
                                        onAddClick={this.onCalloutAddClick}
                                        onCloseClick={this.handleCloseCallout}
                                    ></AnnotationsPanel>
                                ) : (
                                    <AddEditPanel
                                        text={this.state.annotationForAddEditPanel?.text}
                                        isBackButton={this.state.isFromClickOnAnnotation}
                                        onBackButtonClick={this.onCalloutBackClick}
                                        headerText={
                                            this.state.isAdding
                                                ? this.translate(
                                                      "chart.annotations.add.panel.header",
                                                      {
                                                          date: getShortFormatedDate(
                                                              this.state.annotationForAddEditPanel
                                                                  .timestamp,
                                                          ),
                                                      },
                                                  )
                                                : this.translate(
                                                      "chart.annotations.edit.panel.header",
                                                      {
                                                          date: getShortFormatedDate(
                                                              this.state.annotationForAddEditPanel
                                                                  .timestamp,
                                                          ),
                                                      },
                                                  )
                                        }
                                        placeholder={this.translate(
                                            "chart.annotations.panel.textarea.placeholder",
                                        )}
                                        onTextAreaChange={this.onTextAreaChange}
                                        maxCharacters={140}
                                        applyButtonLabel={
                                            this.state.isAdding
                                                ? this.translate(
                                                      "chart.annotations.add.panel.button.label",
                                                  )
                                                : this.translate(
                                                      "chart.annotations.edit.panel.button.label",
                                                  )
                                        }
                                        isDeleteButton={!this.state.isAdding}
                                        onDeleteClick={() => {
                                            this.handleCalloutDeleteAnnotation(
                                                this.state.annotationForAddEditPanel,
                                            );
                                        }}
                                        onApplyClick={
                                            this.state.isAdding
                                                ? this.handleCalloutAddAnnotation
                                                : this.handleCalloutEditAnnotation
                                        }
                                    ></AddEditPanel>
                                )}
                            </CalloutInnerContainer>
                        </AnnotationCallout>
                    ) : null}
                    <Component
                        ref={(chartHC) => {
                            this.chart = chartHC && chartHC.chart;
                            forwardedRef(chartHC);
                        }}
                        callback={(chart) => {
                            afterRender(chart);
                        }}
                        config={chartConfig}
                        domProps={chartDomProps}
                        {...rest}
                        isPureConfig={true}
                    />
                </div>
            );
        }
    }
    function forwardRef(props, ref) {
        function mapDispatchToProps(dispatch) {
            return {
                showError: (text?: string) => dispatch(showErrorToast(text)),
                showSuccess: (text?: string) => dispatch(showSuccessToast(text)),
            };
        }
        const ConnectedAnnotationHOC = connect(null, mapDispatchToProps)(AnnotationHOC);
        return <ConnectedAnnotationHOC {...props} forwardedRef={ref} />;
    }
    const name = Component.displayName || Component.name;
    forwardRef.displayName = `withAnnotation(${name})`;
    return React.forwardRef(forwardRef);
};
