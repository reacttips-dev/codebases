import { NavBarIcon, NavBarSimpleItem } from "@similarweb/ui-components/dist/navigation-bar";
import { ITracker } from "services/competitiveTracker/types";
import { colorsPalettes } from "@similarweb/styles";

export const renderTrackerNavItems = (
    trackers: ITracker[],
    onItemClick: (trackerId: string) => void,
    selectedTrackerId?: string,
) => {
    return trackers?.map((tracker) => {
        return (
            <NavBarSimpleItem
                key={tracker.id}
                id={tracker.id}
                text={tracker.name}
                isSelected={tracker.id === selectedTrackerId}
                onClick={() => onItemClick(tracker.id)}
            />
        );
    });
};

export const renderGroupIcon = (isGroupActive: boolean) => {
    return (
        <NavBarIcon
            iconName="tracker"
            iconSize="xs"
            iconColor={
                isGroupActive
                    ? colorsPalettes.navigation.ACTIVE_BLUE
                    : colorsPalettes.navigation.ICON_DARK
            }
        />
    );
};
