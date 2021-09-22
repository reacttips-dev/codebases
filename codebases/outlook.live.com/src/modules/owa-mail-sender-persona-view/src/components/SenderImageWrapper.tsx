import SenderImage from './SenderImage';
import type { PersonaSize } from '@fluentui/react/lib/Persona';
import type Message from 'owa-service/lib/contract/Message';
import * as React from 'react';
import isMessageUnauthenticated from '../utils/isMessageUnauthenticated';
import { getUserConfiguration } from 'owa-session-store';

export interface SenderImageWrapperProps {
    message: Message;
    displaySelf: boolean;
    style?: string;
    isUnauthenticatedSender?: boolean;
    size?: PersonaSize;
    showPresence?: boolean;
    displayPersonaHighlightRing?: boolean;
    disablePersonaCardBehavior?: boolean;
}

const SenderImageWrapper = (props: SenderImageWrapperProps) => {
    const { message, ...other } = props;
    const userConfiguration = getUserConfiguration();
    return userConfiguration.SegmentationSettings.DisplayPhotos ? (
        <SenderImage
            sender={message.From ? message.From : message.Sender}
            {...other}
            isUnauthenticatedSender={
                props.isUnauthenticatedSender || isMessageUnauthenticated(message)
            }
        />
    ) : null;
};

export default SenderImageWrapper;
