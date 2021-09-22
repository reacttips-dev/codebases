import closeUILessAddinCommand from './closeUILessAddinCommand';
import { getExtensibilityState, InvokeAppAddinCommandStatusCode } from 'owa-addins-store';

export default function closeAllUILessAddinsForItem(hostItemIndex: string) {
    if (getExtensibilityState().runningUILessExtendedAddinCommands.has(hostItemIndex)) {
        [
            ...getExtensibilityState().runningUILessExtendedAddinCommands.get(hostItemIndex).keys(),
        ].forEach((controlId: string, index: number) => {
            closeUILessAddinCommand(
                controlId,
                hostItemIndex,
                InvokeAppAddinCommandStatusCode.NavigatedBeforeCompleted
            );
        });
    }
}
