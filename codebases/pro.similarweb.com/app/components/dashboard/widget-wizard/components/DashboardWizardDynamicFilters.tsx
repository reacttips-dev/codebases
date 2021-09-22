import * as React from "react";
import I18n from "components/React/Filters/I18n";
import { StatefulDropdown } from "./StatefulDropdown";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { SWWidget } from "components/widget/widget-types/widget.reg";

export interface IDashboardWizardDynamicFiltersProps {
    availableFilters: any;
    widgetFilters: any;
    changeFilter: (filter: any) => void;
    widgetType: string;
    widgetMetric: string;
    widgetWebSource: string;
    widgetKeys: [];
    widgetDuration: string;
    widgetPreview: any;
}

const DashboardWizardDynamicFilters: React.StatelessComponent<IDashboardWizardDynamicFiltersProps> = ({
    availableFilters,
    widgetFilters,
    changeFilter,
    widgetType,
    widgetMetric,
    widgetPreview,
    widgetKeys,
    widgetWebSource,
    widgetDuration,
}) => {
    const onSelect = (filterName) => {
        return (item) => {
            changeFilter({
                ...item,
                name: filterName,
            });
        };
    };
    const widgetClass = SWWidget[`${widgetType}Widget`];
    const WidgetFiltersComponent =
        typeof widgetClass.getFiltersComponent === "function"
            ? widgetClass.getFiltersComponent()
            : false;
    let _filters = [];
    {
        Object.keys(availableFilters).forEach((filterName) => {
            //Show dynamic filter only if it has more than 1 select option.
            if (availableFilters[filterName].length > 1) {
                _filters.push(
                    <div key={filterName} className="dynamicFilter">
                        <h5>
                            <I18n>{`home.dashboards.wizard.filters.${filterName}`}</I18n>
                        </h5>
                        <StatefulDropdown
                            key={filterName}
                            items={availableFilters[filterName]}
                            selectedId={
                                widgetFilters[filterName] && widgetFilters[filterName].toString()
                            }
                            onSelect={onSelect(filterName)}
                        />
                    </div>,
                );
            }
        });
    }
    return WidgetFiltersComponent ? (
        <WidgetFiltersComponent
            widgetPreview={widgetPreview}
            widgetMetric={widgetMetric}
            widgetFilters={widgetFilters}
            changeFilter={changeFilter}
            widgetWebSource={widgetWebSource}
            widgetDuration={widgetDuration}
            widgetKeys={widgetKeys}
        />
    ) : (
        <div key="dynamicFiltersContainer" className="filters">
            {_filters}
        </div>
    );
};
SWReactRootComponent(DashboardWizardDynamicFilters, "DashboardWizardDynamicFilters");

export default DashboardWizardDynamicFilters;
