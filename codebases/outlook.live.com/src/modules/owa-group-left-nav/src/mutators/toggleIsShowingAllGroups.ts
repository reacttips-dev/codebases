import { getLeftNavGroupsStore } from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('toggleIsShowingAllGroups', function toggleIsShowingAllGroups() {
    getLeftNavGroupsStore().shouldShowAllGroups = !getLeftNavGroupsStore().shouldShowAllGroups;
});
