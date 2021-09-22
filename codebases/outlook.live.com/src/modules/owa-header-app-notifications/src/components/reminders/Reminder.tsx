import { reminders_dismiss_title } from './DismissReminderButton.locstring.json';
import { reminders_snooze_title } from './SnoozeButton.locstring.json';
import { observer } from 'mobx-react-lite';
import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { ContextualMenu, IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { Icon } from '@fluentui/react/lib/Icon';
import { ControlIcons } from 'owa-control-icons';
import type { OwaDate } from 'owa-datetime';
import ReminderCharm from './ReminderCharm';
import { ANIMATION_DURATION } from '../../utils/reminderAnimationConstants';
import loc from 'owa-localize';
import type ItemId from 'owa-service/lib/contract/ItemId';
import ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import {
    InsightsDataFetchSource,
    isInsightsInReminderEnabled,
} from 'owa-meeting-insights-types-and-flights';
import {
    lazyFetchMeetingInsights,
    lazyLogInsightSummaryClicked,
    InsightsRenderLoggingHelper,
} from 'owa-meeting-insights';
import { getReminderInsightsProps } from 'owa-meeting-insights/lib/selectors/insightsForReminderSelectors';
import {
    default as logReminderAction,
    CalendarReminderCustomData,
} from '../../utils/reminderInstrumentationHelpers';
import { useId } from '@fluentui/react-hooks';
import { useBooleanState } from 'owa-react-hooks/lib/useBooleanState';
import { useToggleState } from 'owa-react-hooks/lib/useToggleState';

import styles from './Reminder.scss';
import classnamesBind from 'classnames/bind';
const classnames = classnamesBind.bind(styles);
import animations from './ReminderAnimations.scss';

export interface ReminderProps {
    reminderId: ItemId;
    reminderType: ReminderGroupTypes;
    charmId: number;
    subject: string;
    location: string;
    startTimeDisplayString: string;
    timeUntilDisplayString: string;
    snoozeMenuItems: IContextualMenuItem[];
    navigateToReminder: (reminder: string, reminderType: ReminderGroupTypes) => void;
    dismissReminder: (reminder: ItemId) => void;
    now?: () => OwaDate;
}

const Reminder: React.FunctionComponent<ReminderProps> = props => {
    const {
        reminderId,
        snoozeMenuItems,
        subject,
        location,
        charmId,
        startTimeDisplayString,
        timeUntilDisplayString,
        reminderType,
        navigateToReminder,
        dismissReminder,
    } = props;

    const [isFocused, setFocused, setNotFocused] = useBooleanState(false);
    const [isSnoozeMenuOpen, toggleSnoozeMenuOpen, , setSnoozeMenuClosed] = useToggleState(false);

    const snoozeButtonId = useId('snooze_');
    const focusZoneRef = React.useRef<FocusZone>();

    const isInsightsEnabled = isInsightsInReminderEnabled(reminderType);

    let insightsProps;
    if (isInsightsEnabled) {
        insightsProps = getReminderInsightsProps(reminderId.Id);
    }
    const showThirdLine = insightsProps != null;

    React.useEffect(() => {
        if (isInsightsEnabled) {
            lazyFetchMeetingInsights
                .importAndExecute(reminderId.Id, InsightsDataFetchSource.Reminder)
                .catch(() => {
                    /*
                     * fetchMeetingInsights has to return a rejected promise to tell if the task is completed or not, for the TaskQueue to schedule the next fetch task.
                     * The catch is to swallow the thrown error from fetchMeetingInsights. No need to handle the error as it is already logged inside fetchMeetingInsights.
                     */
                });
        }

        logReminderAction('ReminderRendered', reminderType, getAdditionalCustomData());

        return () => {
            logReminderAction('ReminderDismissed', reminderType, getAdditionalCustomData());
        };
    }, []);

    const onInsightsSummaryClicked = React.useCallback(
        (evt: React.MouseEvent<HTMLElement>) => {
            lazyLogInsightSummaryClicked.importAndExecute(
                reminderId.Id /* eventId */,
                InsightsDataFetchSource.Reminder
            );
        },
        [reminderId]
    );

    const onReminderClick = React.useCallback(() => {
        navigateToReminder?.(reminderId.Id, reminderType);

        logReminderAction('ReminderClicked', reminderType, getAdditionalCustomData());
    }, [navigateToReminder, reminderType, reminderId]);

    const getAdditionalCustomData = React.useCallback((): CalendarReminderCustomData | null => {
        // For calendar reminder, return the type of insight rendered on the reminder
        if (reminderType === ReminderGroupTypes.Calendar) {
            const insightProps = getReminderInsightsProps(reminderId.Id);
            if (insightProps) {
                return { insightType: insightProps.insightType };
            }
        }

        // No insight rendered
        return null;
    }, [reminderType, reminderId]);

    const onDismissReminder = React.useCallback(
        (ev: React.MouseEvent<any>) => {
            ev.stopPropagation();
            dismissReminder?.(reminderId);
        },
        [dismissReminder, reminderId]
    );

    const onToggleSnoozeMenu = React.useCallback(
        (ev: React.MouseEvent<any>) => {
            ev.stopPropagation();
            toggleSnoozeMenuOpen();
        },
        [isSnoozeMenuOpen]
    );

    const onCloseSnoozeMenu = React.useCallback((ev: React.MouseEvent<any>) => {
        ev.stopPropagation();
        setSnoozeMenuClosed();
    }, []);

    const onReminderRef = React.useCallback(
        (ref: FocusZone) => {
            // Currently, React doesn't support focusin/focusout events, despite our browser matrix doing so
            //  https://github.com/facebook/react/issues/6410
            //  https://caniuse.com/#feat=focusin-focusout-events
            // Alternatively, we can't use the :focus-within pseudo-class, since neither Edge nor IE support it,
            // and those browsers are our main accessibility stories
            //  https://caniuse.com/#feat=css-focus-within

            if (focusZoneRef.current) {
                //tslint:disable-next-line:react-strict-mode  Tracked by WI 91579
                const element = ReactDOM.findDOMNode(focusZoneRef.current) as HTMLElement;

                if (element) {
                    element.removeEventListener('focusin', setFocused);
                    element.removeEventListener('focusout', setNotFocused);
                }
            }

            focusZoneRef.current = ref;

            if (focusZoneRef.current) {
                //tslint:disable-next-line:react-strict-mode  Tracked by WI 91579
                const element = ReactDOM.findDOMNode(focusZoneRef.current) as HTMLElement;

                if (element) {
                    element.addEventListener('focusin', setFocused);
                    element.addEventListener('focusout', setNotFocused);
                }
            }
        },
        [focusZoneRef.current]
    );
    /**
     * The parent <TransitionGroup> passes several properties that the CSSTransition needs.
     * However, I don't want to expose internal workings to the outside in the props,
     *  so I just pass all props down to the CSSTransition.
     **/
    return (
        <>
            {isInsightsEnabled && (
                <InsightsRenderLoggingHelper
                    eventId={reminderId.Id}
                    source={InsightsDataFetchSource.Reminder}
                    hasInsightsToShow={showThirdLine}
                />
            )}
            <CSSTransition
                {...props}
                timeout={ANIMATION_DURATION}
                classNames={{
                    exit: animations.reminderLeave,
                }}>
                <FocusZone
                    ref={onReminderRef}
                    className={classnames(styles.container, {
                        isSnoozeMenuOpen,
                        isFocused,
                        showThirdLine,
                    })}
                    shouldFocusInnerElementWhenReceivedFocus={true}
                    direction={FocusZoneDirection.horizontal}
                    data-is-focusable={true}>
                    <ActionButton
                        styles={{
                            root: styles.reminderButton,
                            flexContainer: styles.containerFlexContainer,
                        }}
                        onClick={onReminderClick}>
                        {charmId ? (
                            <ReminderCharm iconId={charmId} className={styles.charm} />
                        ) : (
                            <Icon iconName={ControlIcons.Event} className={styles.charm} />
                        )}
                        <div className={styles.textContainer}>
                            <div className={styles.firstLine}>
                                <div className={styles.subject}>{subject}</div>
                                <div className={styles.timeUntil}>{timeUntilDisplayString}</div>
                            </div>
                            <div className={styles.secondLine}>
                                <div className={styles.startTime}>{startTimeDisplayString}</div>
                                <div className={styles.location}>{location}</div>
                            </div>
                            {showThirdLine && (
                                <div
                                    className={styles.thirdLine}
                                    onClick={onInsightsSummaryClicked}>
                                    <Icon
                                        iconName={insightsProps.insightsIcon}
                                        styles={{
                                            root: styles.insightsIcon,
                                        }}
                                    />
                                    <div className={styles.insightsText}>
                                        {insightsProps.insightsText}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ActionButton>
                    <div className={classnames(styles.hoverActions, 'icons')}>
                        <IconButton
                            iconProps={{
                                iconName: ControlIcons.AlarmClock,
                            }}
                            styles={{
                                root: styles.hoverActionRoot,
                                icon: styles.hoverActionIcon,
                            }}
                            id={snoozeButtonId}
                            onClick={onToggleSnoozeMenu}
                            title={loc(reminders_snooze_title)}
                            ariaLabel={loc(reminders_snooze_title)}
                        />
                        <IconButton
                            iconProps={{
                                iconName: ControlIcons.RingerOff,
                            }}
                            styles={{
                                root: styles.hoverActionRoot,
                                icon: styles.hoverActionIcon,
                            }}
                            onClick={onDismissReminder}
                            title={loc(reminders_dismiss_title)}
                            ariaLabel={loc(reminders_dismiss_title)}
                        />
                    </div>
                    {isSnoozeMenuOpen && (
                        <ContextualMenu
                            calloutProps={{
                                layerProps: {
                                    className: styles.snoozeMenuLayer,
                                },
                            }}
                            items={snoozeMenuItems}
                            target={`#${snoozeButtonId}`}
                            onDismiss={onCloseSnoozeMenu}
                        />
                    )}
                </FocusZone>
            </CSSTransition>
        </>
    );
};

export default observer(Reminder);
