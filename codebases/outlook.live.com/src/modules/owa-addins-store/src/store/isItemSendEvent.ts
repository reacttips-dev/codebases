import getAddinCommandForControl from './getAddinCommandForControl';

/**
 * Check if the current add-in calling AppendOnSend is a ItemSend addin
 *
 */
export default function isItemSendEvent(extensionId: string, controlId: string) {
    const addinCommand = getAddinCommandForControl(controlId);
    return !!addinCommand && addinCommand.get_Id() === extensionId + 'ItemSend';
}
