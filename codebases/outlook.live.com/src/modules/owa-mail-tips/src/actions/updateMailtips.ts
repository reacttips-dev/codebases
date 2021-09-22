import { action } from 'satcheljs';

export default action(
    'updateMailtips',
    (composeId: string, fromEmailAddress: string, recipients: string[]) => ({
        composeId,
        fromEmailAddress,
        recipients,
    })
);
