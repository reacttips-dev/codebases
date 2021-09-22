import { observer } from 'mobx-react-lite';
import { Icon } from '@fluentui/react/lib/Icon';
import { ControlIcons } from 'owa-control-icons';
import * as React from 'react';
import { getDensityModeString } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';
import CalendarLtrRegular from 'owa-fluent-icons-svg/lib/icons/CalendarLtrRegular';

import styles from './UpNextV2Event.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface UpNextEventProps {
    eventCountString: string;
    eventName: string;
    eventLocation: string;
    timeUntilEvent: string;
}

export default observer(function UpNextV2Event(props: UpNextEventProps) {
    const hasDensityNext = isFeatureEnabled('mon-densities');
    return (
        <div className={styles.upNextEventContainer}>
            {props.eventCountString && (
                <div className={styles.conflictingEventsCount}>{props.eventCountString}</div>
            )}
            <Icon
                className={classNames(
                    styles.eventIconColumn,
                    !hasDensityNext && styles.eventIconColumnSize
                )}
                iconName={hasDensityNext ? CalendarLtrRegular : ControlIcons.Event}
            />
            <div
                className={classNames(
                    styles.eventDetailsColumn,
                    hasDensityNext && getDensityModeString()
                )}>
                <div className={styles.eventName}>{props.eventName}</div>
                <div className={styles.eventTimeLocationRow}>
                    <div className={styles.eventTime}>{props.timeUntilEvent}</div>
                    {props.eventLocation && (
                        <div className={styles.eventLocation}>{props.eventLocation}</div>
                    )}
                </div>
            </div>
        </div>
    );
});
