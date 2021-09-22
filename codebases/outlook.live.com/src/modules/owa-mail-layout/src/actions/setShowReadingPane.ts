import { action } from 'satcheljs';
export const setShowReadingPane = action(
    'setShowReadingPane',
    function setShowReadingPane(showReadingPane: boolean) {
        return {
            showReadingPane,
        };
    }
);
