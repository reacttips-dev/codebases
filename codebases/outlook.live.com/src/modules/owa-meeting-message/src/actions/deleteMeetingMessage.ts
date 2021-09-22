import { action } from 'satcheljs';
import type MeetingMessage from 'owa-service/lib/contract/MeetingMessage';

export default action(
    'deleteMeetingMessage',
    (item: MeetingMessage, issueDeleteItemCall?: boolean) => ({
        item,
        issueDeleteItemCall,
    })
);
