import { action } from 'satcheljs';

/**
 * Launches Member Management Success Action
 */
export default action('MEMBER_MANAGEMENT_SUCCESS', (groupSmtp: string) => {
    return {
        groupSmtp: groupSmtp,
    };
});
