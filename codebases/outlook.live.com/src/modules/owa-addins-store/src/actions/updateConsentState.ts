import type ConsentStateType from 'owa-service/lib/contract/ConsentStateType';
import getAddinCommandForControl from '../store/getAddinCommandForControl';
import type IAddinCommand from '../store/schema/interfaces/IAddinCommand';
import { action } from 'satcheljs/lib/legacy';

export default action('updateConsentState')(function updateConsentState(
    hostItemIndex: string,
    controlId: string,
    consentState: ConsentStateType
) {
    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
    addinCommand.extension.ConsentState = Number(consentState); // the consent state passed is a string
});
