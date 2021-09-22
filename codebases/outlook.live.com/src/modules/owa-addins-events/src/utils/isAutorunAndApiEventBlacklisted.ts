import { getAddinCommandForControl, IAddinCommand, isAutoRunAddinCommand } from 'owa-addins-store';
import { OutlookEventDispId } from '../schema/OutlookEventDispId';

const blacklistApiEventsForAutorun: number[] = [
    // Currently display dialog is not supported in autorun
    OutlookEventDispId.DISPLAY_DIALOG_DISPID,
];

export default function isAutorunAndApiEventBlacklisted(
    controlId: string,
    dispId: OutlookEventDispId
): boolean {
    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
    const isAutoRun = isAutoRunAddinCommand(addinCommand);
    const isBlacklisted = blacklistApiEventsForAutorun.includes(dispId);

    if (isAutoRun && isBlacklisted) {
        return true;
    }
    return false;
}
