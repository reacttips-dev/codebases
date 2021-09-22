import { action } from 'satcheljs';

/**
 * Launches Add Member Group Success Action
 */
export default action('ADD_GROUP_MEMBER_SUCCESS', (groupSmtp: string) => {
    return {
        groupSmtp: groupSmtp,
    };
});
