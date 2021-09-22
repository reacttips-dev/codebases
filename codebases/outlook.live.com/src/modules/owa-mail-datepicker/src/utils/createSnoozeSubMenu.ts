import { logUsage } from 'owa-analytics';
import loc from 'owa-localize';
import { TableQueryType, getSelectedTableView } from 'owa-mail-list-store';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { unsnooze, scheduleChooseDate } from './createScheduleSubMenu.locstring.json';
import { addHours, OwaDate, startOfHour } from 'owa-datetime';
import {
    IContextualMenuItem,
    IContextualMenuProps,
    ContextualMenuItemType,
    DirectionalHint,
} from '@fluentui/react/lib/ContextualMenu';
import type SubMenuDate from '../store/schema/SubMenuDate';
import showScheduleDatePickerDialog from '../components/ScheduleDatePicker';
import { observableNow } from 'owa-observable-datetime';

const hourOffsetDP = 1;
const hourOffsetLater = 3;

import styles from '../components/ScheduleDatePicker.scss';

// Minimum schedule time for DateTimePicker
export function datePickerMinTime(date: OwaDate) {
    return addHours(startOfHour(date), hourOffsetDP);
}

// Schedule 3 hours into future
export function laterDate(date: OwaDate) {
    return addHours(startOfHour(date), hourOffsetLater);
}

// Log abandonment scenario
function onDismiss() {
    logUsage('TnS_ScheduleItemDismiss', null, { isCore: true });
}

// constructs a submenu from a set of dates where each item allows the user to snooze
// the email according to the date chosen
export default function createSnoozeSubMenu(
    onScheduleItemClicked: (date: OwaDate, isCustomDateChosen?: boolean) => void,
    dates: SubMenuDate[],
    directionalHint: DirectionalHint
): IContextualMenuProps {
    const tableView = getSelectedTableView();

    if (!dates || dates.length == 0 || !onScheduleItemClicked || !tableView) {
        return null;
    }

    const scheduleSubMenu: IContextualMenuItem[] = [];
    const currentTime = observableNow();
    const hourLater = datePickerMinTime(currentTime);

    for (let i = 0; i < dates.length; i++) {
        const { name, secondaryText, date } = dates[i];
        scheduleSubMenu.push({
            key: name,
            name: name,
            secondaryText: secondaryText,
            onClick: () => {
                onScheduleItemClicked(date, false);
            },
        });
    }

    scheduleSubMenu.push({
        key: loc(scheduleChooseDate),
        name: loc(scheduleChooseDate),
        onClick: () => {
            showScheduleDatePickerDialog({
                minTime: hourLater,
                onScheduleItemClicked: date => onScheduleItemClicked(date, true),
            });
        },
    });

    if (
        tableView.tableQuery.type == TableQueryType.Folder &&
        folderIdToName(tableView.tableQuery.folderId) == 'scheduled'
    ) {
        const keyName = loc(unsnooze);

        scheduleSubMenu.push({
            key: '-',
            itemType: ContextualMenuItemType.Divider,
        });
        scheduleSubMenu.push({
            key: keyName,
            name: keyName,
            className: styles.unscheduleText,
            iconProps: {
                iconName: 'Blocked',
            },
            onClick: () => {
                onScheduleItemClicked(undefined /* shouldUnschedule */);
            },
        });
    }

    return {
        items: scheduleSubMenu,
        className: styles.fixWidthContextMenu,
        directionalHint: directionalHint,
        directionalHintFixed: false,
        onMenuDismissed: () => onDismiss(),
    };
}
