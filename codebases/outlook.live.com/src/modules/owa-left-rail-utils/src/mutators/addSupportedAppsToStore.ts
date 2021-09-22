import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/store';
import type { OfficeAppData } from '../store/schema/OfficeApp';

export default mutatorAction(
    'AddSupportedAppsToStore',
    function addSupportedAppsToStore(apps: OfficeAppData[]) {
        getStore().enabledRailItems = apps;
    }
);
