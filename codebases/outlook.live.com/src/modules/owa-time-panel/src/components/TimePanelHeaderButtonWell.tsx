import { openDeeplink } from '../actions/timePanelStoreActions';
import { TodoScenarioConfigSource } from '../constants';
import { getSelectedCalendarItemId, getSelectedTaskId } from '../selectors/timePanelStoreSelectors';
import { IButtonProps, IconButton } from '@fluentui/react/lib/Button';
import { observer } from 'mobx-react-lite';
import { canOpenReadingPaneDeeplinkForItemId } from 'owa-calendar-event-capabilities';
import type { ClientItemId } from 'owa-client-ids';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import { lazyPopoutCalendarReadingPane } from 'owa-popout-calendar';
import { popOutComposeForm } from 'owa-time-panel-compose';
import { getTimePanelConfig } from 'owa-time-panel-config';
import { getCurrentPanelView } from 'owa-time-panel-settings';
import { getToDoReferralData } from 'owa-todo-utils/lib/utils/getToDoReferralData';
import { getCalendarPath, getTodoModuleUrl } from 'owa-url';
import getToDoTaskItemReadDeeplinkUrl from 'owa-url/lib/getToDoTaskItemReadDeeplinkUrl';
import * as React from 'react';
import {
    openCalendarTitleText,
    openCalendarEventDetailsText,
    openTaskDetailsText,
    openToDoTitleText,
    openComposeInNewWindow,
    closePaneTitleText,
} from './TimePanelHeaderButtonWell.locstring.json';

import styles from './TimePanelHeaderButtonWell.scss';

interface TimePanelHeaderButtonWellProps {
    onClosePanel: () => void;
}

export default observer(function TimePanelHeaderButtonWell(props: TimePanelHeaderButtonWellProps) {
    const { onClosePanel } = props;

    const panelView = getCurrentPanelView();

    const calendarItemId = getSelectedCalendarItemId();
    const taskId = getSelectedTaskId();

    const { utmSource, removeFromOwa } = getToDoReferralData(TodoScenarioConfigSource);

    const onClickCalendarEventDetailsDeeplinkCallback = React.useCallback(() => {
        if (calendarItemId) {
            onClickCalendarEventDetailsDeeplink(calendarItemId);
        }
    }, [calendarItemId]);

    let deeplinkButtonProps: IButtonProps | undefined = undefined;
    switch (panelView) {
        case 'Calendar':
        case 'Conflicts':
            if (!getTimePanelConfig().isModuleDeeplinkDisabled) {
                deeplinkButtonProps = {
                    title: loc(openCalendarTitleText),
                    href: getCalendarPath(),
                    onClick: onClickCalendarModuleDeeplink,
                };
            }
            break;
        case 'EventDetails':
        case 'AttendeeTracking':
            deeplinkButtonProps =
                // To avoid adding a dependency on loading calendar event data to this top-level package
                // we are currently doing a cheap, non-exhaustive check on the ItemId format to
                // conditionally hide the deeplink for items returned by GetAvailabilityInternal API
                // (which have ItemId set to a random GUID)
                //
                // TODO: VSO #62270 Consume canOpenReadingPaneDeeplink in Time Panel
                canOpenReadingPaneDeeplinkForItemId(calendarItemId)
                    ? {
                          title: loc(openCalendarEventDetailsText),
                          onClick: onClickCalendarEventDetailsDeeplinkCallback,
                      }
                    : undefined;
            break;
        case 'Tasks':
            if (!getTimePanelConfig().isModuleDeeplinkDisabled) {
                deeplinkButtonProps = {
                    title: loc(openToDoTitleText),
                    href: getTodoModuleUrl(utmSource, removeFromOwa),
                    onClick: onClickToDoModuleDeeplink,
                };
            }
            break;
        case 'TaskDetails':
            deeplinkButtonProps = {
                title: loc(openTaskDetailsText),
                href: getToDoTaskItemReadDeeplinkUrl(taskId, utmSource, removeFromOwa),
                onClick: onClickTaskDetailsDeeplink,
            };
            break;
        case 'ComposeForm':
            deeplinkButtonProps = {
                title: loc(openComposeInNewWindow),
                onClick: onClickCalendarComposeForm,
            };
            break;
        default:
            deeplinkButtonProps = undefined;
    }

    return (
        <div className={styles.buttonWellContainer}>
            {deeplinkButtonProps && (
                <IconButton
                    {...deeplinkButtonProps}
                    iconProps={{ iconName: ControlIcons.MiniExpandMirrored }}
                    target={'_blank'}
                    styles={{
                        icon: styles.deeplinkButtonIcon,
                    }}
                />
            )}
            {getTimePanelConfig().isClosePaneButtonEnabled ? (
                <IconButton
                    title={loc(closePaneTitleText)}
                    onClick={onClosePanel}
                    iconProps={{ iconName: ControlIcons.ChromeClose }}
                    styles={{
                        icon: styles.closeButtonIcon,
                    }}
                />
            ) : (
                <div className={styles.emptySpacer} />
            )}
        </div>
    );
});

function onClickCalendarModuleDeeplink(): void {
    openDeeplink('CalendarModule');
}

function onClickCalendarEventDetailsDeeplink(itemId: ClientItemId): void {
    openDeeplink('CalendarEventDetails');
    lazyPopoutCalendarReadingPane.importAndExecute(itemId, 'TimePanelPeek', undefined);
}

function onClickToDoModuleDeeplink(): void {
    openDeeplink('TasksModule');
}

function onClickTaskDetailsDeeplink(): void {
    openDeeplink('TaskDetails');
}

function onClickCalendarComposeForm(): void {
    openDeeplink('ComposeForm');
    popOutComposeForm();
}
