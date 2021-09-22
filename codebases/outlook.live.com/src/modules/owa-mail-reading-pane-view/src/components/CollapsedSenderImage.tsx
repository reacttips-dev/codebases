import shouldShowMeetingFeed from '../utils/shouldShowMeetingFeed';
import { observer } from 'mobx-react-lite';
import { SenderImageWrapper } from 'owa-mail-sender-persona-view';
import type { ClientMessage } from 'owa-mail-store';
import { MeetingIcon } from 'owa-meeting-message';
import type MeetingMessage from 'owa-service/lib/contract/MeetingMessage';
import * as React from 'react';
import { calculatePersonaSize } from 'owa-persona/lib/utils/calculatePersonaSize';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';

import styles from './ConversationReadingPane.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);
export interface CollapsedSenderImageProps {
    message: ClientMessage;
    isDraft: boolean;
    isNodePending: boolean;
}

const CollapsedSenderImage = observer(function CollapsedSenderImage(
    props: CollapsedSenderImageProps
) {
    const { message, isDraft, isNodePending } = props;
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const densityModeString = getDensityModeString();

    const senderPersona = (
        <SenderImageWrapper
            message={message}
            displaySelf={isDraft || isNodePending}
            style={classNames(styles.senderImageContainer, hasDensityNext && densityModeString)}
            isUnauthenticatedSender={message.AntispamUnauthenticatedSender}
            size={calculatePersonaSize()}
            showPresence={true}
            displayPersonaHighlightRing={true}
            disablePersonaCardBehavior={true}
        />
    );

    if (shouldShowMeetingFeed(message)) {
        return (
            <MeetingIcon
                message={message as MeetingMessage}
                senderPersona={senderPersona}
                className={classNames(
                    styles.senderImageContainer,
                    hasDensityNext && densityModeString
                )}
            />
        );
    } else {
        return senderPersona;
    }
});

export default CollapsedSenderImage;
