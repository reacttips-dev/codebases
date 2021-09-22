import { lazyMountAndShowPhotoPickerDialog } from 'owa-photo-picker-dialog';
import { getUserConfiguration } from 'owa-session-store';

export default async function changePhotoRouteHandler() {
    let userConfiguration = getUserConfiguration();
    if (!userConfiguration.SegmentationSettings.SetPhoto) {
        return;
    }

    await lazyMountAndShowPhotoPickerDialog.importAndExecute();
}
