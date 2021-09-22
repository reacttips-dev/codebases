import { action } from 'satcheljs';

export const removeSharingLinks = action('REMOVE_SHARING_LINKS', (linkIds: string[]) => ({
    linkIds: linkIds,
}));
