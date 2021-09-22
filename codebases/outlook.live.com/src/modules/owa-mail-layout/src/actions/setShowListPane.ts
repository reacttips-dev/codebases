import { action } from 'satcheljs';
export const setShowListPane = action(
    'setShowListPane',
    function setShowListPane(showListPane: boolean) {
        return {
            showListPane,
        };
    }
);
