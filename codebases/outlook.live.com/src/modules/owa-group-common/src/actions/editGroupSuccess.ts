import { action } from 'satcheljs';

/**
 * Launches Edit Group Success Action
 */
export default action('EDIT_GROUP_SUCCESS', (groupSmtp: string, photoUrl: string) => {
    return {
        groupSmtp: groupSmtp,
        photoUrl: photoUrl,
    };
});
