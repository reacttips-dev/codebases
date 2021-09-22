import { observer } from 'mobx-react-lite';
import { ObservableMap } from 'mobx';
import {
    scheduleCancelButton,
    scheduleDialogHeader,
    customNavigateButton,
} from './ScheduleDatePicker.locstring.json';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogFooter, DialogType } from '@fluentui/react/lib/Dialog';
import {
    addDays,
    addHours,
    isAfter,
    OwaDate,
    startOfDay,
    formatFullUserDateTime,
} from 'owa-datetime';
import { DateTimePicker } from 'owa-datetimepicker';
import loc from 'owa-localize';
import { scheduleSaveButton } from 'owa-locstrings/lib/strings/schedulesavebutton.locstring.json';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';
import { MruCache } from 'owa-mru-cache';
import { observableNow } from 'owa-observable-datetime';
import { wrapInApolloProvider } from 'owa-apollo';

import styles from './ScheduleDatePicker.scss';

export interface ScheduleDatePickerOverrideableProps {
    minTime: OwaDate;
    onScheduleItemClicked: (date: OwaDate) => void;
    acceptButtonText?: string;
    snapToInterval?: boolean;
    targetWindow?: Window;
    title?: string;
    SuggestionDatePicker?: React.ElementType;
}

export interface ScheduleDatePickerProps extends ScheduleDatePickerOverrideableProps {
    onClose: () => void;
}

const cachedItems = new MruCache<Object>(3);
cachedItems.initialize(new ObservableMap<string, Object>());

const DatePicker = observer(function DatePicker(props: ScheduleDatePickerProps) {
    const {
        minTime,
        acceptButtonText,
        onClose,
        onScheduleItemClicked,
        snapToInterval,
        title,
        SuggestionDatePicker,
    } = props;

    const defaultDate = React.useMemo(() => {
        const currentTime = observableNow();
        const today8AM = addHours(startOfDay(currentTime), 8);
        // if minTime is after today8AM, use tomorrow 8AM.
        return isAfter(minTime, today8AM) ? addDays(today8AM, 1) : today8AM;
    }, []);

    const [scheduledTime, setScheduledTime] = React.useState(defaultDate);
    const [isAdvanced, setIsAdvanced] = React.useState(false);

    const onChanged = (date: OwaDate) => {
        setScheduledTime(date);
    };

    const onScheduleDatePickerSave = React.useCallback(() => {
        setIsAdvanced(false);
        cachedItems.add(scheduledTime.toString(), {
            text: formatFullUserDateTime(scheduledTime),
            date: scheduledTime,
        });
        onScheduleItemClicked(scheduledTime);
        onClose();
        lazyResetFocus.importAndExecute();
    }, [onScheduleItemClicked, onClose, scheduledTime]);

    const onScheduleDatePickerCancel = React.useCallback(() => {
        setIsAdvanced(false);
        onClose();
        lazyResetFocus.importAndExecute();
    }, [onClose]);

    const onClick = () => {
        setIsAdvanced(!isAdvanced);
    };

    return (
        <Dialog
            key="ScheduleDatePicker"
            hidden={false}
            onDismiss={onScheduleDatePickerCancel}
            dialogContentProps={{
                type: DialogType.normal,
                title: title ? loc(title) : loc(scheduleDialogHeader),
                showCloseButton: true,
            }}
            styles={{
                main:
                    !SuggestionDatePicker || isAdvanced
                        ? styles.fixWidthContextMenuAdvanced
                        : styles.fixWidthContextMenuSuggestion,
            }}>
            {SuggestionDatePicker && !isAdvanced ? (
                <SuggestionDatePicker
                    setScheduledTime={setScheduledTime}
                    onScheduleDatePickerSave={onScheduleDatePickerSave}
                    cachedItems={cachedItems}
                />
            ) : (
                <DateTimePicker
                    minDate={minTime}
                    initialValue={defaultDate}
                    onChanged={onChanged}
                    showDuration={false}
                    snapToInterval={snapToInterval}
                />
            )}
            <DialogFooter styles={{ actionsRight: styles.footerRight }}>
                {SuggestionDatePicker && !isAdvanced && (
                    <DefaultButton onClick={onClick}>{loc(customNavigateButton)}</DefaultButton>
                )}
                {(!SuggestionDatePicker || isAdvanced) && (
                    <PrimaryButton
                        onClick={onScheduleDatePickerSave}
                        text={acceptButtonText ? acceptButtonText : loc(scheduleSaveButton)}
                    />
                )}
                <DefaultButton
                    onClick={onScheduleDatePickerCancel}
                    text={loc(scheduleCancelButton)}
                />
            </DialogFooter>
        </Dialog>
    );
});

export default function showScheduleDatePickerDialog(props: ScheduleDatePickerOverrideableProps) {
    const {
        minTime,
        onScheduleItemClicked,
        acceptButtonText,
        snapToInterval,
        targetWindow,
        title,
        SuggestionDatePicker,
    } = props;
    const dialogDiv = (targetWindow || window).document.createElement('div');
    dialogDiv.id = 'snoozeDatePickerDialog';
    (targetWindow || window).document.body.appendChild(dialogDiv);

    function cleanup() {
        ReactDOM.unmountComponentAtNode(dialogDiv);
        (targetWindow || window).document.body.removeChild(dialogDiv);
    }

    ReactDOM.render(
        wrapInApolloProvider(() => (
            <React.StrictMode>
                <WindowProvider window={targetWindow || window}>
                    <DatePicker
                        minTime={minTime}
                        onScheduleItemClicked={onScheduleItemClicked}
                        onClose={cleanup}
                        acceptButtonText={acceptButtonText}
                        snapToInterval={snapToInterval}
                        title={title}
                        SuggestionDatePicker={SuggestionDatePicker}
                    />
                    ,
                </WindowProvider>
            </React.StrictMode>
        ))(),
        dialogDiv
    );
}
