import { action } from 'satcheljs';

export default action(
    'UPDATE_FOLDER_COUNTS',
    (unreadCount: number, totalCount: number, folderId: string, isDeltaChange: boolean) => {
        return {
            unreadCount,
            totalCount,
            folderId,
            isDeltaChange,
        };
    }
);
