import * as React from "react";
import { StatefulDropdown } from "./StatefulDropdown";
import { trafficChannelsService } from "services/TrafficChannelsService";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import I18n from "components/React/Filters/I18n";

export interface IDashboardWizardChannelSelectionProps {
    isActive: boolean;
    selectedChannel: string;
    changeChannel: (channel: string) => void;
}

const DashboardWizardChannelSelection: React.StatelessComponent<IDashboardWizardChannelSelectionProps> = ({
    isActive,
    selectedChannel,
    changeChannel,
}) => {
    const onSelect = (item) => {
        changeChannel(item);
    };
    if (isActive) {
        return (
            <div className="channels">
                <h5>
                    <I18n>home.dashboards.wizard.trafficSource.channels.title</I18n>
                </h5>
                <StatefulDropdown
                    key={"trafficChannels"}
                    items={trafficChannelsService.getAvailableTrafficChannels().map((item) => ({
                        id: item.id,
                        text: item.text,
                    }))}
                    selectedId={selectedChannel}
                    onSelect={onSelect}
                />
            </div>
        );
    } else {
        return null;
    }
};
SWReactRootComponent(DashboardWizardChannelSelection, "DashboardWizardChannelSelection");

export default DashboardWizardChannelSelection;
