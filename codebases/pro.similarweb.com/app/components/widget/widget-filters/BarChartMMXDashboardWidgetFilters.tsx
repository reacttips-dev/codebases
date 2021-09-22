import { dashboardWizardDataModeChanged } from "components/dashboard/widget-wizard/actions/dashboardWizardActionCreators";
import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import I18n from "components/React/Filters/I18n";
import * as React from "react";
import { FC, useEffect } from "react";
import { connect } from "react-redux";

const BarChartMMXDashboardWidgetFilters: FC<any> = (props) => {
    useEffect(() => {
        if (!props.widget?.dataMode) {
            onSelectDataMode({ id: "percent" });
        }
    }, []);

    const selectedFilters = {
        includeSubDomains: props.widgetFilters.includeSubDomains,
    };
    const onSelectDataMode = (item) => {
        props.changeDataMode(props.dashboardWizard, item.id);
    };

    const onSelectincludeSubDomains = (item) => {
        selectedFilters.includeSubDomains = item.id;
        props.changeFilter(getSelectedFilters());
    };

    const getSelectedFilters = () => {
        let filters = [];
        for (let filter in selectedFilters) {
            filters.push({ name: filter, value: selectedFilters[filter] });
        }
        return filters;
    };
    return (
        <div key="dynamicFiltersContainer" className="filters">
            <div key="dataMode" className="dynamicFilter">
                <h5>
                    <I18n>{`home.dashboards.wizard.filters.Metric`}</I18n>
                </h5>
                <StatefulDropdown
                    key="dataMode"
                    items={[
                        { key: "percent", id: "percent", text: "% Relative" },
                        { key: "number", id: "number", text: "# Absolute" },
                    ]}
                    selectedId={props.widget.dataMode || "percent"}
                    onSelect={onSelectDataMode}
                />
            </div>
            <div key="includeSubDomains" className="dynamicFilter">
                <h5>
                    <I18n>{`home.dashboards.wizard.filters.includeSubDomains`}</I18n>
                </h5>
                <StatefulDropdown
                    key="includeSubDomainsFilter"
                    items={[
                        { id: "true", text: "Yes" },
                        { id: "false", text: "No" },
                    ]}
                    selectedId={selectedFilters.includeSubDomains}
                    onSelect={onSelectincludeSubDomains}
                />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const {
        customDashboard: { dashboardWizard },
    } = state;
    const { widget } = dashboardWizard;
    return {
        widget,
        dashboardWizard,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        changeDataMode: (customDashboard, dataMode) => {
            dispatch(dashboardWizardDataModeChanged(customDashboard, dataMode));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BarChartMMXDashboardWidgetFilters);
