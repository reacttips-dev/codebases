import { confirm, DialogResponse } from 'owa-confirm-dialog';

/**
 * Show an error message dialog without cancel button
 * @param messageTitle
 * @param messageSubText
 */
export default function showErrorMessage(
    messageTitle: string,
    messageSubText: string
): Promise<DialogResponse> {
    return confirm(messageTitle, messageSubText, false, {
        hideCancelButton: true,
    });
}
