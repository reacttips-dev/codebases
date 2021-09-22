import { observer } from 'mobx-react-lite';
import type MeetingMessageButtonEntrySource from '../store/schema/MeetingMessageButtonEntrySource';
import { logUsage } from 'owa-analytics';
import { assertNever } from 'owa-assert';
import loc from 'owa-localize';
import { removeTooltip } from 'owa-locstrings/lib/strings/removetooltip.locstring.json';
import { rsvpLabel } from 'owa-locstrings/lib/strings/rsvplabel.locstring.json';
import {
    isMeetingCancellation,
    isMeetingRequest,
    lazyRemoveCancelledMeetingFromCalendar,
    lazyLogMeetingMessageActionForInvite,
} from 'owa-meeting-message';
import { lazyShowRSVPPeek, lazyHideRSVPPeek, RSVPPeek } from '../index';
import shouldShowRSVPPeek from '../selectors/shouldShowRSVPPeek';
import type MeetingCancellationMessageType from 'owa-service/lib/contract/MeetingCancellationMessageType';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import { getUserConfiguration } from 'owa-session-store';
import { getDensityModeString } from 'owa-fabric-theme';
import { DefaultButton, IButtonStyles } from '@fluentui/react/lib/Button';
import { useKeydownHandler } from 'owa-hotkeys';
import * as React from 'react';
import { useId } from '@fluentui/react-hooks';
import { touchHandler, ITouchHandlerParams } from 'owa-touch-handler';
import { FocusZone } from '@fluentui/react/lib/FocusZone';
import { isFeatureEnabled } from 'owa-feature-flags';
import ProjectionContext from 'owa-popout-v2/lib/context/ProjectionContext';

import styles from './MailListMessageButton.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MeetingMessageButtonProps {
    item: Partial<MeetingRequestMessageType> | MeetingCancellationMessageType;
    entrySource: MeetingMessageButtonEntrySource;
    onAction?: () => void;
    onRemoveMeeting?: () => void;
    isSelected: boolean;
}

export default observer(function MeetingMessageButton(props: MeetingMessageButtonProps) {
    React.useEffect(() => {
        const { item, entrySource } = props;
        let buttonType;
        if (isMeetingRequest(item.ItemClass)) {
            buttonType = 'RSVP';
        } else if (isMeetingCancellation(item.ItemClass)) {
            buttonType = 'Remove';
        } else {
            assertNever(item.ItemClass as never);
        }
        const readingPanePosition = getUserConfiguration().UserOptions
            .GlobalReadingPanePositionReact;
        logUsage('MeetingMessageButtonShown', { buttonType, entrySource, readingPanePosition });
    }, []);

    const targetWindow = React.useContext(ProjectionContext);
    const containerRef = React.useRef<HTMLDivElement>();
    const rsvpButtonId = useId('rsvpBtn');

    const onShowPeek = React.useCallback(
        (evt: KeyboardEvent) => {
            if (isMeetingRequest(props.item.ItemClass)) {
                onRSVP(evt);
            } else {
                onRemove(evt);
            }
        },
        [props.item.ItemClass]
    );
    useKeydownHandler(containerRef, 'enter', onShowPeek);

    // No prevent default, no stop propagation.
    // Will let it bubble up so LV capture if no action was done
    const onClose = React.useCallback(
        (evt: KeyboardEvent) => {
            // Just hide and swallow the events if the peek is being shown
            const { item, entrySource } = props;
            if (
                isMeetingRequest(item.ItemClass) &&
                shouldShowRSVPPeek(item.ItemId.Id, entrySource)
            ) {
                evt.preventDefault();
                evt.stopPropagation();
                lazyHideRSVPPeek.importAndExecute();
            }
        },
        [props.item, props.entrySource]
    );
    useKeydownHandler(containerRef, 'escape', onClose, {
        stopPropagation: false,
        preventDefault: false,
    });

    const touchHandler_0 = {
        get() {
            const touchHandlerParams: ITouchHandlerParams = {
                onLongPress: onContextMenu,
                onClick: onRSVP,
            };
            return touchHandler(touchHandlerParams);
        },
    };

    const onRemove = (ev?: any) => {
        ev.stopPropagation();
        lazyLogMeetingMessageActionForInvite.importAndExecute(
            'RemoveFromCalendar',
            props.item,
            'RSVPPeek'
        );
        lazyRemoveCancelledMeetingFromCalendar.importAndExecute(props.item, targetWindow);
        props.onAction?.();
        props.onRemoveMeeting?.();
    };
    const onRSVP = (evt?: any) => {
        evt.stopPropagation();
        lazyShowRSVPPeek.importAndExecute(props.item, props.entrySource);
    };
    const onContextMenu = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
    };
    const onDoubleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
    };

    const { item, entrySource } = props;
    let actionButton = null;
    const hasDensityNext = isFeatureEnabled('mon-densities');

    const buttonStyles: IButtonStyles = {
        root: isFeatureEnabled('mon-tri-mailListMeetingInvite')
            ? classNames(
                  styles.meetingInviteContainerNext,
                  !hasDensityNext && styles.meetingInviteContainerNextShape,
                  hasDensityNext && styles.meetingInviteTextNext,
                  hasDensityNext && getDensityModeString()
              ) // Container widths have been factored out because they override the ThemeProvider
            : classNames(styles.container, !hasDensityNext && styles.containerShape),
        label: styles.labelText,
        textContainer: styles.labelText,
    };
    if (isMeetingRequest(item.ItemClass)) {
        actionButton = (
            <div {...touchHandler_0.get()} ref={containerRef}>
                <DefaultButton
                    id={rsvpButtonId}
                    styles={buttonStyles}
                    title={loc(rsvpLabel)}
                    text={loc(rsvpLabel)}
                    ariaLabel={loc(rsvpLabel)}
                    onClick={onRSVP}
                    onDoubleClick={onDoubleClick}
                    onContextMenu={onContextMenu}
                />
                {shouldShowRSVPPeek(item.ItemId.Id, entrySource) ? (
                    <RSVPPeek
                        item={item}
                        calloutTarget={`#${rsvpButtonId}`}
                        onAction={props.onAction}
                    />
                ) : null}
            </div>
        );
    } else if (isMeetingCancellation(item.ItemClass)) {
        actionButton = (
            <div {...touchHandler({ onClick: onRemove })} ref={containerRef}>
                <DefaultButton
                    styles={buttonStyles}
                    title={loc(removeTooltip)}
                    text={loc(removeTooltip)}
                    ariaLabel={loc(removeTooltip)}
                    onClick={onRemove}
                    onDoubleClick={onDoubleClick}
                />
            </div>
        );
    }
    return <FocusZone disabled={!props.isSelected}>{actionButton}</FocusZone>;
});
