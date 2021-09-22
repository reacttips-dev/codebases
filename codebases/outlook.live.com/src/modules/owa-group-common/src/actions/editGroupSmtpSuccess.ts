import { action } from 'satcheljs';

/**
 * Launches Edit Group Smtp Success Action
 */
export default action(
    'EDIT_GROUP_SMTP_SUCCESS',
    (aadObjectId: string, groupSmtp: string, photoUrl: string, oldGroupSmtp: string) => {
        return {
            aadObjectId: aadObjectId,
            groupSmtp: groupSmtp,
            photoUrl: photoUrl,
            oldGroupSmtp: oldGroupSmtp,
        };
    }
);
