import { webPushStore } from '../store/store';
import { setWebPushPermission } from '../actions/permissionActions';
import { mutator } from 'satcheljs';

export const setCalloutHidden = mutator(setWebPushPermission, ({ permission }) => {
    webPushStore.webPushPermission = permission;
});
