import { action } from 'satcheljs';
import type { MailFolder } from 'owa-graph-schema';

/**
 * Remove a favorite public folder
 * @param folder the folder to be remove
 */
export default action('REMOVE_PUBLIC_FOLDER_FROM_FAVORITES', (folder: MailFolder) => {
    return {
        folder,
    };
});
