import * as React from 'react';
import loc from 'owa-localize';
import { observer } from 'mobx-react-lite';
import { lightable, lighted, LightningProps } from 'owa-lightning-v2';
import { TeachingBubble } from '@fluentui/react/lib/TeachingBubble';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import {
    meetNowTeachingBubbleHeadline,
    meetNowTeachingBubbleCloseButtonLabel,
    meetNowTeachingBubbleBody,
} from '../constants/MeetNowStrings.locstring.json';
import styles from './MeetNowTeachingBubble.scss';

export interface MeetNowTeachingBubbleProps extends LightningProps {
    target: React.RefObject<HTMLDivElement>;
}

const MeetNowTeachingBubble = lightable(
    observer(function MeetNowTeachingBubble(props: MeetNowTeachingBubbleProps) {
        const onDismiss = React.useCallback(() => {
            lighted(props.lid);
        }, []);

        return (
            <TeachingBubble
                calloutProps={{
                    beakWidth: 15,
                    preventDismissOnScroll: true,
                    preventDismissOnLostFocus: true,
                    directionalHint: DirectionalHint.bottomCenter,
                    className: styles.teachingBubble,
                }}
                target={props.target}
                isWide={false}
                onDismiss={onDismiss}
                hasCloseButton={true}
                hasSmallHeadline={true}
                closeButtonAriaLabel={loc(meetNowTeachingBubbleCloseButtonLabel)}
                headline={loc(meetNowTeachingBubbleHeadline)}>
                <span>{loc(meetNowTeachingBubbleBody)}</span>
            </TeachingBubble>
        );
    })
);

export default MeetNowTeachingBubble;
