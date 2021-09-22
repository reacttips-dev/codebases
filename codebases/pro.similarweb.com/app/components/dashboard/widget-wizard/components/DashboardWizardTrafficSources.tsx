import * as React from "react";
import { StatefullIconSwitcher, IStatefullIconSwitcherItem } from "./StatefullIconSwitcher";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import I18n from "components/React/Filters/I18n";

export interface IDashboardWizardTrafficSourcesProps {
    isActive: boolean;
    availableTrafficSources: IStatefullIconSwitcherItem[];
    selectedTrafficSource: number;
    changeTrafficSource: (trafficSource: string) => void;
}
const DashboardWizardTrafficSources: React.StatelessComponent<IDashboardWizardTrafficSourcesProps> = ({
    isActive,
    availableTrafficSources,
    selectedTrafficSource,
    changeTrafficSource,
}) => {
    const onSelect = (item) => {
        changeTrafficSource(item);
    };
    if (isActive) {
        return (
            <div className="devices">
                <h4>
                    <I18n>home.dashboards.wizard.settings.title</I18n>
                </h4>
                <h5>
                    <I18n>home.dashboards.wizard.trafficSource.title</I18n>
                </h5>
                <StatefullIconSwitcher
                    items={availableTrafficSources}
                    selected={selectedTrafficSource}
                    onItemClicked={onSelect}
                />
            </div>
        );
    } else {
        return <div></div>;
    }
};
SWReactRootComponent(DashboardWizardTrafficSources, "DashboardWizardTrafficSources");

export default DashboardWizardTrafficSources;
