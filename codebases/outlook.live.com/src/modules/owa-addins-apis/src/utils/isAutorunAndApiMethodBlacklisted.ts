import { getAddinCommandForControl, IAddinCommand, isAutoRunAddinCommand } from 'owa-addins-store';
import { OutlookMethodDispId } from '../apis/OutlookMethodDispId';

const blacklistApiMethodsForAutorun: number[] = [
    OutlookMethodDispId.DisplayAppointmentForm,
    OutlookMethodDispId.DisplayMessageForm,
    OutlookMethodDispId.DisplayNewAppointmentForm,
    OutlookMethodDispId.DisplayNewMessageForm,
    OutlookMethodDispId.MESSAGE_PARENT_DISPID,
    // displayDialog does not have OutlookMethodDispId, it has OutlookEventDispId and is handled in isAutoRunAndApiEventBlacklisted.ts
];

export default function isAutorunAndApiMethodBlacklisted(
    controlId: string,
    dispId: OutlookMethodDispId
): boolean {
    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
    const isAutoRun = isAutoRunAddinCommand(addinCommand);
    const isBlacklisted = blacklistApiMethodsForAutorun.includes(dispId);

    if (isAutoRun && isBlacklisted) {
        return true;
    }
    return false;
}
