import listViewStore from '../store/Store';

/**
 * This function is deprecated as we will move away from global getters.
 * Please pass in the tableViewId as parameter or prop from caller components/actions.
 */
export default function getSelectedTableViewId(): string {
    return listViewStore.selectedTableViewId;
}
