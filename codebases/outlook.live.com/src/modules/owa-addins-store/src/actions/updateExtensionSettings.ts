import getAddinCommandForControl from '../store/getAddinCommandForControl';
import type IAddinCommand from '../store/schema/interfaces/IAddinCommand';
import { action } from 'satcheljs/lib/legacy';

export default action('updateExtensionSettings')(function updateExtensionSettings(
    hostItemIndex: string,
    controlId: string,
    settings: string
) {
    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
    addinCommand.extension.Settings = settings;
});
