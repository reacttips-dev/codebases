import getExtensibilityState from '../store/getExtensibilityState';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'updateFrameworkComponentHostItemIndexMap',
    function updateFrameworkComponentHostItemIndexMap(
        frameworkContainerId: string,
        hostItemIndex?: string
    ) {
        const { frameworkComponentHostItemIndexMap } = getExtensibilityState();
        if (hostItemIndex) {
            frameworkComponentHostItemIndexMap.set(frameworkContainerId, hostItemIndex);
        } else {
            frameworkComponentHostItemIndexMap.delete(frameworkContainerId);
        }
    }
);
