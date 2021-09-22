import { action } from 'satcheljs';
export default action('TOGGLE_FAVORITE_GROUPNODE_FROM_LEFTNAV', (groupId: string) => {
    return {
        groupId,
    };
});
