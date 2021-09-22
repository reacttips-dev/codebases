import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import { action } from 'satcheljs';

export const onComposeCloseAction = action('onComposeClose', (hostItemIndex: string) => ({
    hostItemIndex,
}));

export default function closeApiMethod(hostItemIndex: string, controlId: string) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;
    adapter.close();
    onComposeCloseAction(hostItemIndex);
}
