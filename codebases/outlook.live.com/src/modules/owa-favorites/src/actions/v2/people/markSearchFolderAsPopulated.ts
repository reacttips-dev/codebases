import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

export const MARK_FOLDER_POPULATED_TIMEOUT = 30000;

export default action('markSearchFolderAsPopulated', (favoriteId: string) =>
    addDatapointConfig(
        {
            name: 'MarkSearchFolderAsPopulated',
        },
        {
            favoriteId,
        }
    )
);
