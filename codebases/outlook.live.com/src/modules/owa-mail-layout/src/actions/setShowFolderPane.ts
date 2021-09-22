import { action } from 'satcheljs';
export const setShowFolderPane = action(
    'setShowFolderPane',
    function setShowFolderPane(showFolderPane: boolean) {
        return {
            showFolderPane,
        };
    }
);
