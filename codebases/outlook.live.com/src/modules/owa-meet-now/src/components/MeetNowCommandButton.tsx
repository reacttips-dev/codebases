import {
    meetNowButtonLabel,
    meetNowButtonLabelA,
    meetNowButtonLabelB,
} from '../constants/MeetNowStrings.locstring.json';
import { isFeatureEnabled } from 'owa-feature-flags';
import openMeetNowWindow, { ScenarioName } from '../services/openMeetNowWindow';
import { CommandBarButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import * as React from 'react';

import styles from './MeetNowCommandButton.scss';
import classNames from 'classnames';
import MeetNowTeachingBubble from './MeetNowTeachingBubble';
import { isGetStartedUser } from 'owa-session-store/lib/utils/isGetStartedUser';
import { isEdu } from 'owa-bpos-utils';
import { LightningId } from 'owa-lightning-core-v2';

export interface MeetNowCommandButtonProps {
    rootStyles?: string;
    scenario: ScenarioName;
}

export default function MeetNowCommandButton(props: MeetNowCommandButtonProps) {
    const onClickCallback = React.useCallback(() => openMeetNowWindow(props.scenario), [
        props.scenario,
    ]);
    const meetNowLabel = selectMeetNowLabelVariant();
    const commandBarButtonRef = React.useRef<HTMLDivElement>(null);
    const lightupWithDelay = (lightup: () => void) => {
        if (isFeatureEnabled('getStarted-CardDesign') && isGetStartedUser() && isEdu()) {
            setTimeout(() => {
                lightup();
            }, 5000);
        }
    };

    return (
        <div
            className={classNames(styles.horizontalContainer, props.rootStyles, 'o365sx-button')}
            ref={commandBarButtonRef}>
            <CommandBarButton
                iconProps={{
                    iconName: ControlIcons.Video,
                }}
                text={loc(meetNowLabel)}
                styles={{
                    root: classNames(styles.buttonRoot),
                    icon: classNames('o365sx-button', styles.buttonIconContainer),
                    textContainer: styles.buttonTextContainer,
                }}
                onClick={onClickCallback}
            />
            <MeetNowTeachingBubble
                lid={LightningId.OnboardingExperienceTeamsCallout}
                when={lightupWithDelay}
                target={commandBarButtonRef}
            />
        </div>
    );
}

function selectMeetNowLabelVariant() {
    if (isFeatureEnabled('fwk-meetNowButtonLabelA')) {
        return meetNowButtonLabelA;
    } else if (isFeatureEnabled('fwk-meetNowButtonLabelB')) {
        return meetNowButtonLabelB;
    } else {
        return meetNowButtonLabel;
    }
}
