import * as React from "react";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import { connect } from "react-redux";
import {
    dashboardWizardWebSourceChanged,
    dashboardWizardDurationChanged,
    dashboardWizardCountryChanged,
    fetchMetricMetaData,
    dashboardWizardFilterChanged,
    dashboardWizardKeyChanged,
    dashboardWizardKeyAppend,
    dashboardWizardKeyRemove,
    dashboardWizardSelectedChannelChanged,
    dashboardWizardWidgetTypeChanged,
    updateGAVerifiedDataFilter,
    dashboardWizardMetricAndFamilyChanged,
} from "./actions/dashboardWizardActionCreators";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { allTrackers } from "services/track/track";
import DashboardWizardAutocomplete from "./components/DashboardWizardAutocomplete";
import DashboardWizardTrafficSources from "./components/DashboardWizardTrafficSources";
import DashboardWizardDuration from "./components/DashboardWizardDuration";
import DashboardWizardDynamicFilters from "./components/DashboardWizardDynamicFilters";
import DashboardWizardCountry from "./components/DashboardWizardCountry";
import DashboardWizardChannelSelection from "./components/DashboardWizardChannelSelection";
import DashboardWizardMetrics from "./components/DashboardWizardMetrics";
import I18n from "components/React/Filters/I18n";

//todo: define interfaces.

class DashboardWizard extends InjectableComponent {
    constructor(props) {
        super(props);

        // When a user selects new metric - we have to make sure that widgetType action is dispatched in order
        // to update the avilable filters
        props.changeWidgetType(
            {
                type: props.customDashboard.widget.type,
                id: props.customDashboard.selectedWidgetType,
            },
            props.customDashboard,
        );

        if (props.customDashboard.widget.key.length > 0) {
            props.updateGAVerifiedDataFilter(
                props.customDashboard.widget.key,
                props.customDashboard,
            );
        }
    }

    public componentDidUpdate(prevProps) {
        const prevWidget = prevProps.customDashboard.widget;
        const newWidget = this.props.customDashboard.widget;

        // If user action triggered a webSource change - we have to make sure the webSource action is dispatched in order
        // to update the available durations.
        if (prevWidget.webSource !== newWidget.webSource) {
            if (!newWidget.key.store) {
                return this.props.changeWebSource(newWidget.webSource, this.props.customDashboard);
            }
        }

        // If user action triggered a comparedDuration change - we have to make sure the changeKey action is dispatched in order
        // to update the available widget types.
        if (prevWidget.comparedDuration !== newWidget.comparedDuration) {
            this.props.changeKey(newWidget.key, this.props.customDashboard);
            if (!newWidget.key.store && newWidget.key.length > 0) {
                this.props.updateGAVerifiedDataFilter(newWidget.key, this.props.customDashboard);
                return;
            }
        }

        // If user action triggered a widgetType change - we have to make sure the updateGAVerifiedDataFilter action is dispatched in order
        // to update the GAVerified flag.
        if (prevWidget.type !== newWidget.type || prevWidget.metric !== newWidget.metric) {
            if (newWidget.family === "Website" && newWidget.key.length > 0) {
                return this.props.updateGAVerifiedDataFilter(
                    newWidget.key,
                    this.props.customDashboard,
                );
            }
        }
    }

    private changeCountry = (itemId) => {
        this.props.changeCountry(itemId, this.props.customDashboard);
    };

    private changeMetric = (metricId) => {
        this.props.changeMetric(metricId, this.props.customDashboard);
    };

    private changeTrafficSource = (item) => {
        allTrackers.trackEvent("Capsule Button", "switch", `Data Source/${item}`);
        this.props.changeWebSource(item, this.props.customDashboard);
    };

    private changeChannel = (item) => {
        allTrackers.trackEvent("Drop Down", "click", `Channel/${item.text}`);
        this.props.changeSelectedChannel(item, this.props.customDashboard);
    };

    private changeFilter = (item) => {
        if (!Array.isArray(item)) {
            allTrackers.trackEvent("Drop Down", "click", `${item.name}/${item.text}`);
        }
        this.props.changeFilter(item, this.props.customDashboard);
    };

    render() {
        return (
            <div>
                <DashboardWizardMetrics
                    changeMetric={this.changeMetric}
                    family={this.props.customDashboard.widget.family}
                    selectedMetric={this.props.customDashboard.widget.metric}
                />
                <DashboardWizardAutocomplete
                    fetchMetricMetaData={this.props.fetchMetricMetaData}
                    keyAppend={this.props.keyAppend}
                    keyRemove={this.props.keyRemove}
                    updateGAVerifiedDataFilter={this.props.updateGAVerifiedDataFilter}
                    customDashboard={this.props.customDashboard}
                />

                <DashboardWizardTrafficSources
                    isActive={this.props.customDashboard.formElements.webSource.isActive}
                    availableTrafficSources={this.props.customDashboard.availableTrafficSources}
                    selectedTrafficSource={this.props.customDashboard.widget.webSource}
                    changeTrafficSource={this.changeTrafficSource}
                />
                <div key="filtersContainer" className="filters">
                    <DashboardWizardDuration
                        changeDuration={this.props.changeDuration}
                        customDashboard={this.props.customDashboard}
                    />
                    <DashboardWizardCountry
                        key={this.props.customDashboard.widget.country}
                        changeCountry={this.changeCountry}
                        availableCountries={this.props.customDashboard.availableCountries}
                        selectedCountryId={this.props.customDashboard.widget.country}
                        titleComponent={
                            <h5>
                                <I18n>home.dashboards.wizard.country.title</I18n>
                            </h5>
                        }
                    />
                </div>
                <DashboardWizardChannelSelection
                    isActive={this.props.customDashboard.formElements.trafficChannels.isActive}
                    selectedChannel={this.props.customDashboard.widget.selectedChannel}
                    changeChannel={this.changeChannel}
                />
                <DashboardWizardDynamicFilters
                    availableFilters={this.props.customDashboard.availableFilters}
                    widgetFilters={this.props.customDashboard.widget.filters}
                    widgetMetric={this.props.customDashboard.widget.metric}
                    widgetWebSource={this.props.customDashboard.widget.webSource}
                    widgetDuration={this.props.customDashboard.widget.duration}
                    changeFilter={this.changeFilter}
                    widgetType={this.props.customDashboard.widget.type}
                    widgetPreview={this.props.widgetPreview}
                    widgetKeys={this.props.customDashboard.widget.key}
                />
            </div>
        );
    }
}

export function mapDispatchToProps(dispatch) {
    return {
        fetchMetricMetaData: (newKey, customDashboard) => {
            dispatch(fetchMetricMetaData(customDashboard, newKey));
        },
        changeKey: (newKey, customDashboard) => {
            dispatch(dashboardWizardKeyChanged(customDashboard, newKey));
        },
        keyAppend: (newKey, customDashboard) => {
            dispatch(dashboardWizardKeyAppend(customDashboard, newKey));
        },
        keyRemove: (newKey, customDashboard) => {
            dispatch(dashboardWizardKeyRemove(customDashboard, newKey));
        },
        changeWebSource: (newWebSource, customDashboard) => {
            dispatch(dashboardWizardWebSourceChanged(customDashboard, newWebSource));
        },
        changeWidgetType: (newWidgetType, customDashboard) => {
            dispatch(dashboardWizardWidgetTypeChanged(customDashboard, newWidgetType));
        },
        changeDuration: (newDuration, customDashboard, comparedDuration) => {
            dispatch(
                dashboardWizardDurationChanged(customDashboard, newDuration, comparedDuration),
            );
        },
        changeCountry: (newCountry, customDashboard) => {
            dispatch(dashboardWizardCountryChanged(customDashboard, newCountry));
        },
        changeMetric: (metric, customDashboard) => {
            dispatch(
                dashboardWizardMetricAndFamilyChanged(
                    customDashboard,
                    metric,
                    customDashboard.widget.family,
                    customDashboard.widget.key,
                ),
            );
        },
        changeFilter: (newFilter, customDashboard) => {
            dispatch(dashboardWizardFilterChanged(customDashboard, newFilter));
        },
        changeSelectedChannel: (newSelectedChannel, customDashboard) => {
            dispatch(dashboardWizardSelectedChannelChanged(customDashboard, newSelectedChannel));
        },
        updateGAVerifiedDataFilter: (key, customDashboard) => {
            dispatch(updateGAVerifiedDataFilter(customDashboard, key));
        },
    };
}

function mapStateToProps({ customDashboard: { dashboardWizard } }) {
    return {
        customDashboard: dashboardWizard,
    };
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DashboardWizard);

SWReactRootComponent(connectedComponent, "DashboardWizard");

export default connectedComponent;
