import { action } from 'satcheljs';

/**
 * Launches Delete Group Success Action
 */
export default action('DELETE_GROUP_SUCCESS', (groupSmtp: string) => {
    return {
        groupSmtp: groupSmtp,
    };
});
